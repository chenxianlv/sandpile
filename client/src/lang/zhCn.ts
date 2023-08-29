import lang from './lang';
import { timeDurationFormatter } from '@/utils/formatter';

const messages = {
    lang,
    form: {
        cancel: '取消',
        submit: '提交',
        save: '保存',
        rename: '重命名',
        edit: '编辑',
        delete: '删除',
        requireInput: ({ named }: { named: (prop: string) => any }) => `请输入${named('prop')}`,
        requireSelect: ({ named }: { named: (prop: string) => any }) => `请选择${named('prop')}`,
        charLengthOverflow: ({ named }: { named: (prop: string) => any }) =>
            `请输入${named('max')}个以内的字符`,
    },
    msg: {
        networkError: '网络异常',
        unknownError: '未知错误',
        uploadFileSizeOverflow: ({ named }: { named: (prop: string) => any }) =>
            `文件不得超过${named('size')}`,
        uploadFileFormatNotSupported: '不支持该文件格式',
        uploadFileSuccessWithName: ({ named }: { named: (prop: string) => any }) =>
            `上传文件 ${named('name')} 成功`,
        uploadFolderSuccessWithName: ({ named }: { named: (prop: string) => any }) =>
            `上传文件夹 ${named('name')} 成功`,
    },
    time: {
        second: '秒',
        minute: '分钟',
        hour: '小时',
        day: '天',
    },
    errorCode: {},
    menu: {
        note: '学习笔记',
        '3d': '3D',
    },
    user: {
        login: '登录',
        logout: '退出登录',
        logoutConfirm: '确认要退出登录吗？当前未提交的变更可能会丢失',
        inputUserIdOrUserName: '请输入用户ID或用户名',
        account: '账号',
        password: '密码',
        loginFailed: '登录失败',
    },
    note: {
        searchProject: '搜索项目',
        addProject: '新建项目',
        editProject: '编辑项目',
        projectName: '项目名称',
        owners: '所有者',
        selectAtLeastOneOwner: '请选择至少一个所有者',
        openness: '开放程度',
        opennessHelpText: `完全开放：所有用户包括匿名用户均可查看
部分开放：仅读者及所有者可以查看
私有：仅所有者可以查看`,
        readers: '读者',
        createUsername: '创建者',
        createTime: '创建时间',
        confirmToDelete: '确定删除吗？',
        deleteProjectConfirm: ({ named }: { named: (prop: string) => any }) =>
            `若确定删除，请输入项目名称 "${named('projectName')}"。`,
        projectNameError: '请输入正确的项目名',
        saveState: ({ named }: { named: (prop: string) => any }) => {
            const { unit, value } = timeDurationFormatter(named('time'));
            const state = named('state') ? '成功' : '失败';
            return `于 ${value}${(unit && messages.time[unit]) ?? ''} 前保存${state}`;
        },
        editMode: '编辑模式',
        readMode: '阅读模式',
        files: '文件',
        addFile: '新建文件',
        addFolder: '新建文件夹',
        deleteFile: '删除文件',
        deleteFolder: '删除文件夹',
        deleteFileConfirm: ({ named }: { named: (prop: string) => any }) =>
            `确认删除文件 ${named('name')} 吗？`,
        deleteFolderConfirm: ({ named }: { named: (prop: string) => any }) =>
            `确认删除文件夹 ${named('name')} ，以及该文件夹内的所有内容吗？`,
        uploadFile: '上传文件',
        uploadFolder: '上传文件夹',
        fileName: '文件名',
        folderName: '文件夹名',
        inputMdText: '请输入Markdown文本',
        selectNote: '请选择笔记',
    },
    '3d': {
        particleImage: {
            particlesSize: '粒子尺寸',
            particlesMinGrayScale: '粒子最小灰度',
            particlesMaxGrayScale: '粒子最大灰度',
            particlesWidth: '粒子图案宽度',
            particlesHeight: '粒子图案高度',
            particlesNumInWidth: 'x方向粒子栅格数',
            particlesNumInHeight: 'y方向粒子栅格数',
            particlesGenerateWidth: '生成半径',
            particlesGenerateMinDistance: '最小生成距离',
            particlesGenerateMaxDistance: '最大生成距离',
            particlesGenerateRetryLimit: '最大重试次数',
            particlesGenerateColorThreshold: '生成颜色阈值',
            particlesGenerateAlphaThreshold: '生成不透明度阈值',
            particlesGenerateSpeed: '粒子初速度',
            particlesMaxSpeed: '粒子最大速度',
            selectTemplate: '指定模板',
            reGenerate: '重新生成',
            reload: '重置DEMO',
        },
    },
} as const;

export default messages;
