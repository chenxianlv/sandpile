package org.sand.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

/**
 * 通用返回结果，服务端响应的数据最终都会封装成此对象
 * @param <T>
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseDTO<T> {

    private Integer status;

    private Integer errorCode;

    private String errorInfo;

    private T data;

    public static <T> ResponseDTO<T> success() {
        ResponseDTO<T> responseDTO = new ResponseDTO<T>();
        responseDTO.status = 1;
        return responseDTO;
    }

    public static <T> ResponseDTO<T> success(T object) {
        ResponseDTO<T> responseDTO = new ResponseDTO<T>();
        responseDTO.data = object;
        responseDTO.status = 1;
        return responseDTO;
    }

    public static <T> ResponseDTO<T> error(Integer errorCode, String errorInfo) {
        ResponseDTO<T> responseDTO = new ResponseDTO<T>();
        responseDTO.errorCode = errorCode;
        responseDTO.errorInfo = errorInfo;
        responseDTO.status = 0;
        return responseDTO;
    }
}
