import {
	createRouter,
	RouteRecordRaw,
	createWebHistory,
	RouterView
} from 'vue-router'
import App from "../App.vue";
import WidgetRoomContainer from "@/components/room/widget-room-container.vue";


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
				component: WidgetRoomContainer,
				name: 'room'
			}
		]
	}

]

const router = createRouter({
	history: createWebHistory("/main"),
	routes
})

export default router
