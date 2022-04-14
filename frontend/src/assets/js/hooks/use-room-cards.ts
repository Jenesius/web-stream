import RTCConnection from "@/assets/js/rtc-connection";
import {computed, ComputedRef, ref} from "vue";

export default (connections: ComputedRef<RTCConnection[]>) => {
	
	const activeId = ref<string | null>(null);
	const setActive = (id: typeof activeId.value) => {
		activeId.value = id;
	}
	const filteredConnections = computed(() => {
		return connections.value.filter(c => c.id !== activeId.value)
	});
	
	return [filteredConnections, activeId, setActive];
}
