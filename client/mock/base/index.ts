import Mock from 'mockjs';

const users = {
    2: {
        id: 2,
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTEzNzAyMjMsIkFDQ09VTlQiOiJjeGwifQ.HLuTcoTP2c6j1yrijDs4Wo8ZeuUp4M2lzCOqcbb3-XM',
        userName: 'chenxianlv',
        authList: [1, 2, 3, 4, 5],
    },
    3: {
        id: 3,
        token: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTEzNzAyMjMsIkFDQ09VTlQiOiJjeGwifQ.HLuTcoTP2c6j1yrijDs4Wo8ZeuUp4M2lzCOqcbb3-XM',
        userName: '普通用户',
        authList: [1, 3, 5],
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
