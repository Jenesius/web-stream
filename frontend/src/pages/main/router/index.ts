import {
	createRouter,
	RouteRecordRaw,
	createWebHistory,
	RouterView
} from 'vue-router'
import WidgetGroup from "@/components/group/widget-group.vue"
import WidgetRoomContainer from "@/components/room/widget-room-container.vue";
import ViewTest from "./../view/view-test.vue";

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'home',
		component: ViewTest
	},
	{
		path: '/test',
		name: 'test',
		component: ViewTest
	},
	{
		path: '/groups',
		component: RouterView,
		children: [
			{
				path: ':id',
				name: 'group',
				component: WidgetGroup
			}
		]
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
