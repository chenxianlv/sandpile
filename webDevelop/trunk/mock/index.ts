import Mock from 'mockjs';

import './note';
import './base';

console.log('mock enabled');
Mock.setup({
    timeout: '100-300',
});
