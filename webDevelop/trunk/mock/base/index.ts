import Mock from 'mockjs';

Mock.mock(new RegExp('.*' + '/base/logout'), () => {
    return {
        data: {
            id: 2,
            token: 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2ODY0NjEzNTUsIkFDQ09VTlQiOiJjeGwifQ.-2Vcw5rkkRNm9kgnd6KPVdjtsnMjqimxUhTTQ9wklsA',
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
