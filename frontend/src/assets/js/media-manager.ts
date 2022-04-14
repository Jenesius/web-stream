import EventEmitter, {Callback} from "./event-emitter";

import store from "../../pages/main/store/index";
import {MediaCredentials} from "@/types/media";




class SingletonMediaManager extends EventEmitter{
	static EVENT_UPDATE_TRACK = 'tracks:update';
	
	tracks: {
		[name in keyof MediaCredentials]: MediaStreamTrack
	} = {}

	constructor() {
		super();


		// @ts-ignore
		window.mediaManager = this; window.globalTracks = [];
	}
	
	onupdateTrack(callback: Callback){
		return this.on(SingletonMediaManager.EVENT_UPDATE_TRACK, callback);
	}
	
	get isMicrophone() {
		// @ts-ignore
		return store.state.MediaModule.credentials['user-audio'];
	}
	get isCamera() {
		// @ts-ignore
		return store.state.MediaModule.credentials['user-video'];
	}
	get isScreen() {
		// @ts-ignore
		return store.state.MediaModule.credentials['screen-video'];
	}
	
	async camera(v = !this.isCamera) {
		await this.getUserMedia({
			audio: this.isMicrophone, // без изменений
			video: v
		});
	}
	async microphone(v = !this.isMicrophone) {
		await this.getUserMedia({
			audio: v, // без изменений
			video: this.isCamera
		});
	}
	async screen(v = !this.isScreen) {
		
		if (!v) {
			this.stopTrack('display-video');
			return;
		}
		
		const captureStream = await navigator.mediaDevices.getDisplayMedia({
			video: v,
			audio: false
		});
		
		captureStream.getTracks().forEach(track => {
			const kind = track.kind as 'video' | 'audio';
			const kinds:{[name: string]: keyof MediaCredentials} = {
				video: 'display-video',
			}
			
			this.addTrack(kinds[kind], track);
		});
	}
	
	/**
	 * Обновляет трэки связанные с пользователем (camera или microphone)
	 * */
	async getUserMedia(constrains: {video?: boolean, audio?: boolean}) {

		// При отсутствии элементов - чистим их
		if (!constrains.video) this.stopTrack('user-video');
		if (!constrains.audio) this.stopTrack('user-audio');
		
		if (constrains.video && this.tracks["user-video"] && this.tracks["user-video"].readyState === "live") delete constrains.video;
		if (constrains.audio && this.tracks["user-audio"] && this.tracks["user-audio"].readyState === "live") delete constrains['audio'];
		
		if (!Object.values(constrains).includes(true)) return;
		
		const stream = await navigator.mediaDevices.getUserMedia(constrains)
		
		stream.getTracks().forEach(track => {
			const kind = track.kind as 'video';

			const kinds:{[name: string]: keyof MediaCredentials} = {
				video: 'user-video',
				audio: 'user-audio'
			}
			this.addTrack(kinds[kind], track);
		});
	}
	
	private addTrack(type: keyof MediaCredentials, track: MediaStreamTrack) {
		
		// @ts-ignore
		window.globalTracks.push(track);
		const hints: {[name in keyof MediaCredentials]: string} = {
			'user-video': 'motion',
			'user-audio': 'speech',
			'display-video': 'detail'
		}
		
		track.contentHint = <string>hints[type];
		
		
		if (this.tracks[type]) this.tracks[type]?.stop();
		this.tracks[type] = track;
		
		
		
		track.onended = () => {
			this.emit(SingletonMediaManager.EVENT_UPDATE_TRACK);
		}

		this.emit(SingletonMediaManager.EVENT_UPDATE_TRACK);
	}
	
	
	/**
	 * Т.к. track.stop не вызывает событие ended, был реазован допольнительный
	 * метод для остановки трека, который по завершнию диспатчит эвент ended.
	 * */
	private stopTrack(type: keyof MediaCredentials) {
		
		if (!this.tracks[type]) return;
		
		this.tracks[type]?.stop();
		this.tracks[type]?.dispatchEvent(new Event('ended'));
	}
	
	getTracks() {
		return Object.values(this.tracks).filter(track => track.readyState === 'live');
	}
	
	getCredentials() {
		return Object.entries(this.tracks)
		.reduce((acc: {[name: string]:boolean}, entry) => {
			const track = entry[1]
			acc[entry[0]] = track && track.readyState === 'live';
			
			return acc;
		}, {})
	}
	async getDevices() {
		const array = await navigator.mediaDevices.enumerateDevices();
		
		const store: {
			videoinput: MediaDeviceInfo[],
			audioinput: MediaDeviceInfo[],
			audiooutput: MediaDeviceInfo[],
		} = {
			videoinput: [],
			audioinput: [],
			audiooutput: []
		}
		
		
		array.forEach(device => {
			const groupId = device.groupId;
			const kind = device.kind
			
			if (store[kind].find(d => d.groupId === groupId)) return;
			store[kind].push(device);
		})
		
		return store;
		
	}
}

export const MediaManager = new SingletonMediaManager()

