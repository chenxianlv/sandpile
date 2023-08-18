package org.sand.common.constDefine;

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

    FTP_CONNECT_FAILED(12001, "ftp connect failed"),
    FTP_CREATE_FILE_FAILED(12002, "ftp create file failed"),

    PARAMETERS_NOT_VALID(13001, "parameters not valid"),

    MODEL_ADD_FAILED(21001, "model add failed"),

    MODEL_DELETE_FAILED(22001, "model delete failed"),

    MODEL_UPDATE_FAILED(23001, "model update failed"),

    MODEL_SEARCH_FAILED(24001, "model search failed"),
    MODEL_NOT_FOUND(24002, "model not found"),
    ;

    private final Integer errorCode;

    private final String errorInfo;

}
