package org.sand.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import org.sand.common.constDefine.ErrorCodeEnum;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResultException extends Throwable {

    private String errorInfo;

    private Integer errorCode;

    public static ResultException of(Integer errorCode, String errorMessage) {
        ResultException exception = new ResultException();
        exception.setErrorCode(errorCode);
        exception.setErrorInfo(errorMessage);
        return exception;
    }

    public static ResultException of(ErrorCodeEnum errorCodeEnum) {
        ResultException exception = new ResultException();
        exception.setErrorCode(errorCodeEnum.getErrorCode());
        exception.setErrorInfo(errorCodeEnum.getErrorInfo());
        return exception;
    }
}
