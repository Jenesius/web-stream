import { createApp } from 'vue'
import App from './App.vue'
import router from "@/pages/auth/router";

createApp(App).use(router).mount('#app')
