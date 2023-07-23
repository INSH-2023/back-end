import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'

import { ProCalendar } from "@lbgm/pro-calendar-vue";

createApp(App).use(ProCalendar).use(router).mount('#app')
