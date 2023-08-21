const config: {
    /**
     * 笔记编辑的自动保存间隔，单位毫秒
     */
    AUTO_SAVE_INTERVAL: number;
    /**
     * 笔记开放程度枚举
     */
    NOTE_PROJECT_OPENNESS_ENUM: {
        FULL_PUBLIC: 1;
        HALF_PUBLIC: 2;
        PRIVATE: 3;
    };
} = {
    AUTO_SAVE_INTERVAL: 30000,
    NOTE_PROJECT_OPENNESS_ENUM: {
        FULL_PUBLIC: 1,
        HALF_PUBLIC: 2,
        PRIVATE: 3,
    },
};

export default config;
