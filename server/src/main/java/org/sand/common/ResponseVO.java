package org.sand.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.sand.common.ConstDefine.ResponseStatusEnum;

/**
 * 通用返回结果，服务端响应的数据最终都会封装成此对象
 * @param <T>
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseVO<T> {

    private Integer status;

    private Integer errorCode;

    private String errorInfo;

    private T data;

    public static <T> ResponseVO<T> success() {
        ResponseVO<T> responseVO = new ResponseVO<>();
        responseVO.status = ResponseStatusEnum.SUCCESS.getValue();
        return responseVO;
    }

    public static <T> ResponseVO<T> success(T object) {
        ResponseVO<T> responseVO = new ResponseVO<>();
        responseVO.data = object;
        responseVO.status = ResponseStatusEnum.SUCCESS.getValue();
        return responseVO;
    }

    public static <T> ResponseVO<T> error(Integer errorCode, String errorInfo) {
        ResponseVO<T> responseVO = new ResponseVO<>();
        responseVO.errorCode = errorCode;
        responseVO.errorInfo = errorInfo;
        responseVO.status = ResponseStatusEnum.ERROR.getValue();
        return responseVO;
    }

    public static <T> ResponseVO<T> error(ResultException exception) {
        ResponseVO<T> responseVO = new ResponseVO<>();
        responseVO.errorCode = exception.getErrorCode();
        responseVO.errorInfo = exception.getErrorInfo();
        responseVO.status = ResponseStatusEnum.ERROR.getValue();
        return responseVO;
    }
}
