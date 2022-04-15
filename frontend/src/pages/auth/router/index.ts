import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import ViewLogin from './../view/view-login.vue';
import ViewRegistration from './../view/view-registration.vue';

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		component: ViewLogin,
		name: 'login'
	},
	{
		path: '/registration',
		component: ViewRegistration,
		name: 'registration'
	}
]
const router = createRouter({
	routes,
	history: createWebHistory('/auth')
})
export default router;
