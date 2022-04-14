import AudioSystem from "@/assets/js/audio-system";
export default class AudioSystemError extends Error{
	
	details: any;
	constructor(msg: string, details: any) {
		super(msg);
		this.details =details;
	}
	
	
	static AudioContextNotFounded(a: typeof AudioSystem) {
		const msg = `AudioContext не был инициализирова.`;
		return new AudioSystemError(msg, {a});
	}
	
}
