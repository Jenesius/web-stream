import {MediaCredentials} from "@/types/media";
import {Module} from "vuex";

const state: {
	credentials: MediaCredentials
} = {
	credentials: {
		'user-audio': false,
		'user-video': false,
		'display-video': false
	}
}

export const MediaModule:Module<typeof state,  any> = {
	namespaced: true,
	state,
	mutations: {
		UPDATE_CREDENTIALS(state, payload: MediaCredentials) {
			
			Object.assign(state.credentials, payload);
			
		}
	}
}
