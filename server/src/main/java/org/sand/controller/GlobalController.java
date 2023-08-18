package org.sand.controller;

import org.sand.common.ResponseVO;
import org.sand.common.ResultException;
import org.sand.common.constDefine.ErrorCodeEnum;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalController {
    @ExceptionHandler(ResultException.class)
    public ResponseVO<?> handleResultException(ResultException e) {
        return ResponseVO.error(e);
    }

    @ExceptionHandler(BindException.class)
    public ResponseVO<?> handleResultException(BindException e) {
        return ResponseVO.error(ResultException.of(ErrorCodeEnum.PARAMETERS_NOT_VALID));
    }

}
