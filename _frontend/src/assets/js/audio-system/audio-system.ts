/**
 * Глобальная Audio Система.
 * Отвечает за музыку в одном экземпляре
 * */
import EventEmitter from "../event-emitter/event-emitter";

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
	
	async addTrack(track: MediaStreamTrack) {
		
		this.msg(`adding track ${track.id}`)
		
		if (!this.context) throw new Error('test');
		
		try {
			await this.context.resume();
			
			console.log(track);
			this.tracks.push(track);
			
			track.contentHint = "speech"
			
			const mediaSource = this.context.createMediaStreamSource(new MediaStream([track]));
			
			mediaSource.connect(this.context.destination);
			
			
			
			// connect the AudioBufferSourceNode to the gainNode
			// and the gainNode to the destination, so we can play the
			// music and adjust the volume using the mouse cursor
			
			track.addEventListener('ended', () => {
				this.removeTrack(track.id);
			})
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
	
}
const AudioSystem = new SingletonAudioSystem();
export default AudioSystem;
