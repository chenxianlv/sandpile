package org.sand.util;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.sand.common.ConstDefine.ErrorCodeEnum;
import org.sand.common.ResultException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.util.Date;
import java.util.Objects;

@Component
public class TokenUtils {

    /**
     * 创建秘钥
     */
    private final byte[] SECRET = "6MNSobBABCDIO0fS6MNSobBRCHGIO0fS".getBytes();

    /**
     * 过期时间：毫秒数
     */
    @Value("${token.timeout}")
    private Long EXPIRE_TIME;

    /**
     * 生成Token
     */
    public String buildJWT(String account) {
        try {
            // 创建一个32-byte的密匙
            MACSigner macSigner = new MACSigner(SECRET);
            // 建立payload 载体
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .expirationTime(new Date(System.currentTimeMillis()))
                    .claim("ACCOUNT", account)
                    .build();

            // 建立签名
            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);
            signedJWT.sign(macSigner);

            // 生成token
            return signedJWT.serialize();

        } catch (JOSEException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 校验token
     */
    public String validToken(String token) throws ResultException {
        try {
            if (token == null) {
                throw ResultException.of(ErrorCodeEnum.INVALID_TOKEN);
            }
            SignedJWT jwt = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECRET);
            //校验是否有效
            if (!jwt.verify(verifier)) {
                throw ResultException.of(ErrorCodeEnum.INVALID_TOKEN);
            }

            //校验超时
            Date expirationTime = new Date(jwt.getJWTClaimsSet().getExpirationTime().getTime() +  EXPIRE_TIME);
            if (new Date().after(expirationTime)) {
                throw ResultException.of(ErrorCodeEnum.EXPIRED_TOKEN);
            }

            //获取载体中的数据
            Object account = jwt.getJWTClaimsSet().getClaim("ACCOUNT");
            //是否有openUid
            if (Objects.isNull(account)){
                throw ResultException.of(ErrorCodeEnum.ACCOUNT_EMPTY);
            }
            return account.toString();
        } catch (ParseException | JOSEException e) {
            throw ResultException.of(ErrorCodeEnum.INVALID_TOKEN);
        }
    }
}
