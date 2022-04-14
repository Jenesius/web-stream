import {ref} from "vue";

export default () => {
	
	const activeId = ref<string | null>(null);
	const setActive = (id: typeof activeId.value) => {
		activeId.value = id;
	}

	
	return [activeId, setActive];
}
