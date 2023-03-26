/**
 * 仅当请求响应时间超过该时间时，才展示loading
 */
export const LOADING_START_OFFSET_TIME = 50;
export const LOADING_MIN_DURATION_TIME = 300;

/**
 * 请求该数组内的url，响应有错误时，不会交由axios拦截器进行统一错误处理
 *
 * url值即为调用axios方法时传入的url属性，不包含baseUrl
 */
export const CUSTOM_ERROR_HANDLE_URL: string[] = [];

export const LOCALSTORAGE_USER_PROP_NAME = 'sp_user';
