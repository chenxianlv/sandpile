export default {
    api: {
        /**
         * 是否在开发模式下打印请求信息
         */
        PRINT_IN_DEV: true,

        /**
         * http请求url的前缀
         */
        BASE_URL: '/api',

        /**
         * 请求该数组内的url，响应有错误时，不会交由axios拦截器进行统一错误处理
         * url值即为调用axios方法时传入的url属性，不包含baseUrl
         */
        CUSTOM_ERROR_HANDLE_URL: ['/user/signup', '/user/login'],

        /**
         * 在开发模式下，校验每个请求的请求体data的类型
         */
        VALIDATE_REQUEST_DATA_IN_DEV: true,

        /**
         * 在开发模式下，校验每个请求的响应体data的类型
         */
        VALIDATE_RESPONSE_DATA_IN_DEV: true,
    },
    mock: {
        /**
         * 是否在开发模式下启用mock
         */
        // ENABLED_IN_DEV: true,
        ENABLED_IN_DEV: false,
    },
    loading: {
        /**
         * 开始loading后，若在该时间内（单位毫秒）没有关闭loading，才会开始展示loading
         */
        START_OFFSET_TIME: 50,

        /**
         * 开始展示loading后，loading至少会展示该段时间（单位毫秒），才会关闭
         */
        MIN_DURATION_TIME: 300,
    },
    storage: {
        /**
         * localstorage中，用于保存用户信息的字段名
         */
        USER_PROP_NAME: 'sp_user',
    },
} as const;
