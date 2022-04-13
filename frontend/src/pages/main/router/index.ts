import {
	createRouter,
	RouteRecordRaw,
	createWebHistory,
	RouterView
} from 'vue-router'
import App from "@/App.vue";
import WidgetRoomPreset from "@/components/room/widget-room-preset.vue";


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
				component: WidgetRoomPreset,
				name: 'room'
			}
		]
	}

]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router
