package org.sand.common.ConstDefine;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCodeEnum {

    INVALID_TOKEN(11001, "invalid token"),
    EXPIRED_TOKEN(11002, "expired token"),
    ACCOUNT_EMPTY(11003, "account is empty"),
    LOG_IN_FIRST(11004, "log in first"),
    WRONG_ACCOUNT_OR_PASSWORD(11005, "wrong account or password"),
    INSUFFICIENT_PERMISSIONS(11006, "insufficient permissions"),
    ;


    private final Integer errorCode;

    private final String errorInfo;

}
