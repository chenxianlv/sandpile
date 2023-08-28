import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/styles/cleanUp.less';
import '@/styles/common.less';
import baseConfig from '@/config/base';
import { i18n } from '@/lang';
import 'virtual:svg-icons-register';

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

app.mount('#app');
