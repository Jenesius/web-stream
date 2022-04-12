export type StreamTrackType = 'screen-video' | 'user-audio' | 'user-video';
export default class RTCTrack extends MediaStreamTrack {
	readonly localType: StreamTrackType
	
	static wrap(track: MediaStreamTrack, type: StreamTrackType): RTCTrack {
		return Object.defineProperties(track, {localType: {value: type}}) as RTCTrack;
	}
	
}
