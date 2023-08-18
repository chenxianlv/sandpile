import Mock from 'mockjs';

const users = {
    2: {
        id: 2,
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTEzNzAyMjMsIkFDQ09VTlQiOiJjeGwifQ.HLuTcoTP2c6j1yrijDs4Wo8ZeuUp4M2lzCOqcbb3-XM',
        userName: 'chenxianlv',
        authList: [10001, 20001, 20002, 20003, 20004, 20005, 20006],
    },
    3: {
        id: 3,
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTEzNzAyMjMsIkFDQ09VTlQiOiJjeGwifQ.HLuTcoTP2c6j1yrijDs4Wo8ZeuUp4M2lzCOqcbb3-XM',
        userName: '普通用户',
        authList: [10001, 20001, 20003, 20005, 20006],
    },
};
Mock.mock(new RegExp('.*' + '/base/login'), () => {
    return {
        data: users[2],
        // data: users[3],
        status: 1,
    };
});

Mock.mock(new RegExp('.*' + '/base/logout'), () => {
    return {
        status: 1,
    };
});
