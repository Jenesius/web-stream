import ApplicationMediaManager from "./application-media-manager"
import store from "../../store";
import Socket from "./sockets/socket";
export default function initialization() {
	ApplicationMediaManager.onupdateTrack( () => {
		
		
		const tracks = ApplicationMediaManager.tracks;
		
		const payload = Object.entries(tracks)
		.reduce((acc: any, cell) => {
			const value = cell[1];
			
			acc[cell[0]] = value.readyState === 'live'
			
			return acc;
		}, {})
		
		//console.log(`[store] constrains ${JSON.stringify(payload)}`);
		
		store.dispatch({type: 'media:update-constrains', payload})
		
	})

	
}


