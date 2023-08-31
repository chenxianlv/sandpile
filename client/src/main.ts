import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/styles/cleanUp.less';
import '@/styles/common.less';
import baseConfig from '@/config/base';
import { i18n } from '@/lang';
import vAuth from '@/directives/vAuth';
import 'virtual:svg-icons-register'; // vite svg加载器所需指令

import App from './App.vue';
import router from './router';

if (import.meta.env.DEV) {
    baseConfig.mock.ENABLED_IN_DEV && import('../mock');
}

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(i18n);

app.directive('Auth', vAuth);

app.mount('#app');
