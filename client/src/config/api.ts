const config: {
    /**
     * 是否在开发模式下打印请求信息
     */
    PRINT_IN_DEV: boolean;

    /**
     * http请求url的前缀
     */
    BASE_URL: '/api';

    /**
     * 请求该数组内的url，响应有错误时，不会交由axios拦截器进行统一错误处理
     * url值即为调用axios方法时传入的url属性，不包含baseUrl
     */
    CUSTOM_ERROR_HANDLE_URL: string[];
} = {
    PRINT_IN_DEV: true,

    BASE_URL: '/api',

    CUSTOM_ERROR_HANDLE_URL: [],
};

export default config;
