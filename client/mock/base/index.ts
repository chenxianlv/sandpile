import Mock from 'mockjs';

Mock.mock(new RegExp('.*' + '/base/login'), () => {
    return {
        data: {
            id: 2,
            token: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTEzNzAyMjMsIkFDQ09VTlQiOiJjeGwifQ.HLuTcoTP2c6j1yrijDs4Wo8ZeuUp4M2lzCOqcbb3-XM',
            userName: 'chenxianlv',
        },
        status: 1,
    };
});

Mock.mock(new RegExp('.*' + '/base/logout'), () => {
    return {
        status: 1,
    };
});
