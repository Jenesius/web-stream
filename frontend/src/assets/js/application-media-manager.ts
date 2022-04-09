import EventEmitter, {Callback} from "./event-emitter/event-emitter";

import store from "../../store/index";

type StreamTrackType = 'screen-video' | 'user-audio' | 'user-video';

export default new class ApplicationMediaManager extends EventEmitter{
	
	static EVENT_UPDATE_TRACK = 'tracks:update';
	
	tracks: {
		[name in StreamTrackType]?: MediaStreamTrack
	} = {}

	
	constructor() {
		super();
		
		
		
	}
	
	onupdateTrack(callback: Callback){
		return this.on(ApplicationMediaManager.EVENT_UPDATE_TRACK, callback);
	}
	
	
	get isMicrophone() {
		return store.getState().mediaConstrains.microphone;
	}
	get isCamera() {
		return store.getState().mediaConstrains.camera;
	}
	get isScreen() {
		return store.getState().mediaConstrains.screen;
	}
	
	async camera(v: boolean = !this.isCamera) {
		await this.getUserMedia({
			audio: this.isMicrophone, // без изменений
			video: v
		});
	}
	async microphone(v: boolean = !this.isMicrophone) {
		await this.getUserMedia({
			audio: v, // без изменений
			video: this.isCamera
		});
	}
	async screen(v: boolean = !this.isScreen) {
		
		const captureStream = await navigator.mediaDevices.getDisplayMedia({
			video: v,
			audio: false
		});
		
		captureStream.getTracks().forEach(track => {
			const kind = track.kind as 'video' | 'audio';
			const kinds:{[name: string]: StreamTrackType} = {
				video: 'screen-video',
			}
			
			this.addTrack(kinds[kind], track);
		});
	}
	
	/**
	 * Обновляет трэки связанные с пользователем (camera или microphone)
	 * */
	async getUserMedia(constrains: {video: boolean, audio: boolean}) {

		
		if (!Object.values(constrains).includes(true)) {
			this.stopTrack('user-video');
			this.stopTrack('user-audio');
			return;
		}
		
		const stream = await navigator.mediaDevices.getUserMedia(constrains)
		
		
		
		stream.getTracks().forEach(track => {
			const kind = track.kind as 'video';

			const kinds:{[name: string]: StreamTrackType} = {
				video: 'user-video',
				audio: 'user-audio'
			}
			this.addTrack(kinds[kind], track);
		});
	}
	
	private addTrack(type: StreamTrackType, track: MediaStreamTrack) {
		
		
		const hints = {
			'user-video': 'motion',
			'user-audio': 'speech',
			'screen-video': 'detail'
		}
		track.contentHint = hints[type];
		
		if (this.tracks[type]) this.tracks[type].stop();
		this.tracks[type] = track;
		
		track.contentHint = 'speech';
		
		track.onended = () => {
			this.emit(ApplicationMediaManager.EVENT_UPDATE_TRACK);
		}

		this.emit(ApplicationMediaManager.EVENT_UPDATE_TRACK);
	}
	
	private stopTrack(type: StreamTrackType) {
		
		if (!this.tracks[type]) return;
		
		this.tracks[type].stop();
		this.tracks[type].dispatchEvent(new Event('ended'));
	}
	
	getTracks() {
		return Object.values(this.tracks).filter(track => track.readyState === 'live');
	}
	
}
