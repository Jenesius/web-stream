import {
	createRouter,
	RouteRecordRaw,
	createWebHistory,
	RouterView
} from 'vue-router'
import App from "@/App.vue";
import WidgetRoom from "@/components/room/widget-room.vue";


const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'home',
		component: App
	},
	{
		path: '/rooms',
		component: RouterView,
		children: [
			{
				path: ':id',
				component: WidgetRoom
			}
		]
	}

]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router
