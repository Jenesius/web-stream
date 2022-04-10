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
		console.log(`[rtc-connection] [%cpeer:${this._index}%c]`, 'color: green', 'color: black');
		
		this.clientId = clientId;
		
		this.peerConnection = new RTCPeerConnection({});
		
		tracks.forEach(track => {
			console.log(`[rtc-connection] [%cpeer:${this._index}%c] add track.`, 'color: green', 'color: black', track.id);
			this.peerConnection.addTrack(track)
		});
		
		this.peerConnection.ontrack = (e: RTCTrackEvent) => {
			console.log(`[rtc-connection] [%cpeer:${this._index}%c] new track ${e.track.id}`, 'color: green', 'color: black');
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
		
		this.peerConnection.oniceconnectionstatechange = (e:Event) => {
			console.log(`[rtc-connection] [peer:${this._index}] state is ${this.peerConnection.iceConnectionState}`)
		}
		this.peerConnection.onconnectionstatechange = (e: Event) => {
			console.log(this.peerConnection.connectionState);
		}
		
		
		this.peerConnection.onicecandidate = e => {
			//console.log(`[rtc-connection] add icecandidate ${this._index}`);
			
			this.emit(RTCConnection.EVENT_ON_ICE_CANDIDATE, e.candidate)
		}
		this.peerConnection.onicecandidateerror = e => {
			console.warn(`Handle error PeerConnection with client ${clientId}`, e);
		}
		/*
		// Когда добавляется новый трек
		this.peerConnection.onnegotiationneeded = (e: Event) => {
			console.log(e)
		}
		*/

		
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

