import ApplicationMediaManager from "./application-media-manager"
import store from "../../store";
export default function initialization() {
	ApplicationMediaManager.onupdateTrack( () => {
		
		
		const tracks = ApplicationMediaManager.tracks;
		
		const payload = Object.entries(tracks)
		.reduce((acc: any, cell) => {
			const value = cell[1];
			
			acc[cell[0]] = value.readyState === 'live'
			
			return acc;
		}, {})
		
		store.dispatch({type: 'media:update-constrains', payload})
		
	})
}

