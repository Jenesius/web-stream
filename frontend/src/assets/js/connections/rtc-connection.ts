import EventEmitter from "../event-emitter/event-emitter";

export default class RTCConnection extends EventEmitter{
	
	//static EVENT_NEW_TRACK = 'new-track';
	static EVENT_TRACKS_UPDATE = 'tracks:update';
	static EVENT_ON_ICE_CANDIDATE = 'peer:candidate';
	
	peerConnection: RTCPeerConnection
	clientId: string;
	tracks: MediaStreamTrack[] = []
	
	readonly _index = Math.floor(Math.random() * 10000);
	
	constructor({tracks, clientId}: RTCConnectionParams) {
		super();
		
		this.clientId = clientId;
		
		this.peerConnection = new RTCPeerConnection({});
		
		this.peerConnection.ontrack = (e: RTCTrackEvent) => {
			//console.log(`[rtc-connection] new track ${this._index}`);
			const newTrack = e.track;
			
			this.tracks.push(newTrack);
			
			e.track.onended = e => {
				//console.log(`[rtc-connection] remove track ${this._index}`);
				const index = this.tracks.findIndex(track => track.id === newTrack.id);
				if (index !== -1) this.tracks.splice(index, 1);
				
				this.emit(RTCConnection.EVENT_TRACKS_UPDATE);
			}

			this.emit(RTCConnection.EVENT_TRACKS_UPDATE);
		}
		
		
		this.peerConnection.onicecandidate = e => {
			//console.log(`[rtc-connection] add icecandidate ${this._index}`);
			
			this.emit(RTCConnection.EVENT_ON_ICE_CANDIDATE, e.candidate)
		}
		this.peerConnection.onicecandidateerror = e => {
			console.warn(`Handle error PeerConnection with client ${clientId}`, e);
		}
		
		tracks.forEach(track => this.peerConnection.addTrack(track));
		
		// @ts-ignore
		if (!window.globalPeers) window.globalPeers = []; window.globalPeers.push(this);
		
	}
	
	close() {
		this.peerConnection.close();
		super.cleanEvents();
	}
	
}

interface RTCConnectionParams {
	tracks: MediaStreamTrack[],
	clientId: string,
}

