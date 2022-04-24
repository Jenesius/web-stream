/**
 * Глобальная Audio Система.
 * Отвечает за музыку в одном экземпляре
 * */
// @ts-ignore
import MultiStreamsMixer from 'multistreamsmixer';
import EventEmitter from "./event-emitter";
import AudioSystemError from "@/assets/js/audio-system-error";

class SingletonAudioSystem extends EventEmitter{

	tracks: MediaStreamTrack[] = [];
	
	context?: AudioContext
	constructor() {
		super();
		// @ts-ignore
		window.audioSystem = this;
		
		this.msg('singleton created.')
	}
	
	async init() {
		try {
			if (this.context) {
				this.msg("closing audio-context")
				await this.context.close();
			}
		} catch (e) {
			console.warn(e);
		}
		this.msg("initialize audio-context")
		this.context = new AudioContext();
	}
	
	/**
	 * Добавляет трек в ауди-систему.
	 * На данный момент сделано через жопу. AudioContext вприцныпе не работает.
	 * Основные проблемы описаны в методе addStream
	 * */
	async addTrack(track: MediaStreamTrack) {
		this.msg(`adding track ${track.id}`)
		if (!this.context) throw AudioSystemError.AudioContextNotFounded(this);
		
		try {
			await this.context.resume();
			
			const audio = new Audio();
			const mediaStream = new MediaStream([track]);
			audio.srcObject = mediaStream;
			const context = this.context;
			
			audio.onloadedmetadata = () => {
				audio.play();
				//audio.muted = true;
				const a = context.createMediaElementSource(audio);
				a.connect(context.destination);
			}

		} catch (e) {
			this.msg(JSON.stringify(e));
		}
	}

	removeTrack(id: string) {
		this.msg(`remove track ${id}`)
		const index = this.tracks.findIndex(track => track.id === id)
		if (index === -1) return;
		
		this.tracks.splice(index, 1);
	}
	
	msg(msg: string) {
		console.log(`[%caudio-system%c] ${msg}`, 'color: green', 'color: black')
	}

	addStream(stream: MediaStream) {

		// if (!this.context) throw new Error('test');
		
		//const audio = document.getElementById('audio') as HTMLAudioElement;
		const audio = new Audio();
		const ac = new AudioContext();
		//audio.muted = true;
		/*
		audio.oncanplay = () => {
			console.log('+++');
			audio.play();
		}*/
		audio.srcObject = stream;

		/**/
		/*
		const ctx = new AudioContext();
		const gainNode = ctx.createGain();
		gainNode.gain.value = .5;
		audio.onloadedmetadata = function() {
			console.log("====");
			//const source = ctx.createMediaStreamSource(audio.srcObject);
			const source = ctx.createMediaElementSource(audio);
			audio.play();
			//audio.muted = true;
			source.connect(gainNode);
			gainNode.connect(ctx.destination);
		}
		*/
		
		/**
		 * Следуюзий код не работает с Chromium.
		 * Причина: It is a known issue that remote streams have to be assigned to a media element so that they play on web audio.
		 * StackOverflow: https://stackoverflow.com/questions/71861568/webrtc-with-web-audio-api
		 * ChromeBugs: https://bugs.chromium.org/p/chromium/issues/detail?id=933677#c4
		 *
		 * В Firefox успешно работает
		 *
			const audioMixer = new MultiStreamsMixer([stream]);
			const mixedStream = audioMixer.getMixedStream();
		 	const ms = ac.createMediaStreamSource(mixedStream);
		 	ms.connect(ac.destination);
		 *
		 * */
		
		const audioMixer = new MultiStreamsMixer([stream]);
		const mixedStream = audioMixer.getMixedStream();
		/*
		const ms = ac.createMediaStreamSource(mixedStream);
		ms.connect(ac.destination);*/
		
		audio.onloadedmetadata = async function() {
			await audio.play();
			audio.muted = true;
			const ms = ac.createMediaStreamSource(mixedStream);
			ms.connect(ac.destination);
		}
	}
}
const AudioSystem = new SingletonAudioSystem();
export default AudioSystem;
