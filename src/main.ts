import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import components from './components'
import router from './router'
import './style.less'
import i18n from './locales'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
import i18n from './locales'

const app = createApp(App)

app.use(store)
  .use(router)
  .use(components)
  .use(i18n)
  .mount('#app')
