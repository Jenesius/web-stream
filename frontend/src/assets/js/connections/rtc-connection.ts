import EventEmitter from "./../event-emitter/EventEmitter";

export default class RTCConnection extends EventEmitter{
	
	peerConnection: RTCPeerConnection
	clientId: string
	
	constructor({tracks, emit, clientId, handleTrack, stream}: RTCConnectionParams) {
		super();
		
		this.clientId = clientId;
		
		this.peerConnection = new RTCPeerConnection({});
		
		this.peerConnection.ontrack = handleTrack;
		
		this.peerConnection.onicecandidate = e => {
			console.log('On new candidate');
			
			const candidate = e.candidate;
			emit('peer:candidate', {clientId, candidate})
		}
		this.peerConnection.onicecandidateerror = e => {
			console.warn(`Handle error PeerConnection with client ${clientId}`, e);
		}
		
		tracks.forEach(track => this.peerConnection.addTrack(track, stream));
		
		
	}
	
}

interface RTCConnectionParams {
	tracks: MediaStreamTrack[],
	emit: EventEmitter["emit"],
	clientId: string,
	handleTrack: (e: any) => void,
	stream: any
}

