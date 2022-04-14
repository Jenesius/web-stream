import {MediaCredentials} from "@/types/media";
import {Module} from "vuex";
import {MediaManager} from "@/assets/js/media-manager";

const state: {
	credentials: MediaCredentials,
	devices: {
		'audioinput': MediaDeviceInfo[],
		'audiooutput': MediaDeviceInfo[]
		'videoinput': MediaDeviceInfo[]
	}
} = {
	credentials: {
		'user-audio': false,
		'user-video': false,
		'display-video': false
	},
	devices: {
		'audioinput': [],
		'audiooutput': [],
		'videoinput': [],
	}
}

export const MediaModule:Module<typeof state,  any> = {
	namespaced: true,
	state,
	mutations: {
		UPDATE_CREDENTIALS(state, payload: MediaCredentials) {
			
			Object.assign(state.credentials, payload);
			
		}
	},
	actions: {
		async UPDATE_DEVICES({state}) {
			
			const s = await MediaManager.getDevices()
			state.devices = s;
		}
	}
}
