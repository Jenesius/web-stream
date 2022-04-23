import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Cookies from "js-cookie";
import makeId from "@/assets/js/make-id";

Cookies.set('globalConnectionId', makeId(128));

createApp(App).use(store).use(router).mount('#app')
