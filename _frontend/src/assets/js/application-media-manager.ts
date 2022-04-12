import EventEmitter, {Callback} from "./event-emitter/event-emitter";

import store from "../../store/index";
import RTCTrack from "./rtc-track";

export type StreamTrackType = 'screen-video' | 'user-audio' | 'user-video';

export default new class ApplicationMediaManager extends EventEmitter{
	static EVENT_UPDATE_TRACK = 'tracks:update';
	
	tracks: {
		[name in StreamTrackType]?: RTCTrack
	} = {}

	constructor() {
		super();
		/* @ts-ignore */
		window.mediaManager = this;
		/* @ts-ignore */
		window.globalTracks = [];
	}
	
	onupdateTrack(callback: Callback){
		return this.on(ApplicationMediaManager.EVENT_UPDATE_TRACK, callback);
	}
	
	get isMicrophone() {
		return store.getState().mediaConstrains['user-audio'];
	}
	get isCamera() {
		return store.getState().mediaConstrains['user-video'];
	}
	get isScreen() {
		return store.getState().mediaConstrains['screen-video'];
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
		
		if (!v) {
			this.stopTrack('screen-video');
			return;
		}
		
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

		// При отсутствии элементов - чистим их
		if (!constrains.video) this.stopTrack('user-video');
		if (!constrains.audio) this.stopTrack('user-audio');
		
		if (constrains.video && this.tracks["user-video"] && this.tracks["user-video"].readyState === "live") delete constrains.video;
		if (constrains.audio && this.tracks["user-audio"] && this.tracks["user-audio"].readyState === "live") delete constrains.audio;
		
		if (!Object.values(constrains).includes(true)) return;
		
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
	
	private addTrack(type: StreamTrackType, _track: MediaStreamTrack) {
		
		const track = RTCTrack.wrap(_track, type);
		
		
		// @ts-ignore
		window.globalTracks.push(track);
		const hints = {
			'user-video': 'motion',
			'user-audio': 'speech',
			'screen-video': 'detail'
		}
		track.contentHint = hints[type];
		
		if (this.tracks[type]) this.tracks[type].stop();
		this.tracks[type] = track;
		
		
		
		track.onended = () => {
			this.emit(ApplicationMediaManager.EVENT_UPDATE_TRACK);
		}

		this.emit(ApplicationMediaManager.EVENT_UPDATE_TRACK);
	}
	
	
	/**
	 * Т.к. track.stop не вызывает событие ended, был реазован допольнительный
	 * метод для остановки трека, который по завершнию диспатчит эвент ended.
	 * */
	private stopTrack(type: StreamTrackType) {
		
		if (!this.tracks[type]) return;
		
		this.tracks[type].stop();
		this.tracks[type].dispatchEvent(new Event('ended'));
	}
	
	getTracks() {
		return Object.values(this.tracks).filter(track => track.readyState === 'live');
	}
	getConstrains() {
		Object.fromEntries(
			this.getTracks().map(track => [track.localType, track.id])
		);
	}
	
}
