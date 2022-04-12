/**
 * Глобальная Audio Система.
 * Отвечает за музыку в одном экземпляре
 * */
import EventEmitter from "./event-emitter";

export default new class AudioSystem extends EventEmitter{

	tracks: MediaStreamTrack[] = [];
	
	context?: AudioContext
	constructor() {
		super();
		
		// @ts-ignore
		window.audioSystem = this;
		
	}
	
	async init() {
		try {
			if (this.context)
				await this.context.close();
		} catch (e) {
			console.warn(e);
		}
		this.context = new AudioContext();
	}
	
	async addTrack(track: MediaStreamTrack) {
		
		console.log(this.context);
		
		if (!this.context) return;
		
		console.log('+')
		await this.context.resume();
		console.log('++')
		this.tracks.push(track);
		console.log('+++')
		
		const mediaStreamWrap = new MediaStream([track]);
		const mediaSource = this.context.createMediaStreamSource(mediaStreamWrap);
		const gainNode = this.context.createGain();
		
		gainNode.gain.value = 2;
		mediaSource.connect(gainNode);
		gainNode.connect(this.context.destination);
		

		
		
		// connect the AudioBufferSourceNode to the gainNode
		// and the gainNode to the destination, so we can play the
		// music and adjust the volume using the mouse cursor
		
		track.addEventListener('ended', () => {
			this.removeTrack(track.id);
		})
		
	}

	removeTrack(id: string) {
		
		const index = this.tracks.findIndex(track => track.id === id)
		if (index === -1) return;
		
		this.tracks.splice(index, 1);
	}

}
