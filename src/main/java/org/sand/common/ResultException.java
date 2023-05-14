package org.sand.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResultException extends Throwable {

    private String errorMessage;

    private Integer errorCode;

    public static ResultException of(Integer errorCode, String errorMessage) {
        ResultException exception = new ResultException();
        exception.setErrorCode(errorCode);
        exception.setErrorMessage(errorMessage);
        return exception;
    }
}
