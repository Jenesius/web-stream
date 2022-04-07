import RTCConnection from "../connections/rtc-connection";

export default class PeerConnectionService {
	
	static CONFIGURATION = {}
	
	static EVENT_CANDIDATE = 'peer:candidate';
	static EVENT_OFFER = 'peer:offer';
	
	/**
	 * Возвращает peer connection с пользователем
	 * */
	static async createOffer(socket: any, tracks: MediaStreamTrack[], clientId: string, handleTrack: any, stream: any): Promise<RTCConnection> {
		const rtcConnection = PeerConnectionService.newPeerConnection(socket, tracks, clientId, handleTrack, stream);
		
		const pc = rtcConnection.peerConnection
		
		return pc.createOffer()
		.then(offer => pc.setLocalDescription(offer))
		.then(() => {
			const offer = pc.localDescription;
			socket.emit(PeerConnectionService.EVENT_OFFER, { offer, clientId });
		})
		.then(() => console.log(`Offer for ${clientId} was created.`))
		.then(() => rtcConnection)
	}
	
	/**
	 * @description Когда нам отправили offer, мы регистрируем peerConnection по
	 * дписываем полученный offer и отправляем answer обратно пользователю.
	 * */
	static async createAnswer(socket: any, tracks: MediaStreamTrack[], clientId: string, offer: RTCSessionDescription, handleTrack: any, stream) {
		const rtcConnection = PeerConnectionService.newPeerConnection(socket, tracks, clientId, handleTrack, stream);
		
		const pc = rtcConnection.peerConnection;
		
		return pc.setRemoteDescription(offer)
		.then(() => pc.createAnswer())
		.then(answer => pc.setLocalDescription(answer))
		.then(() => {
			const answer = pc.localDescription;
			socket.emit('peer:answer', { answer, clientId })
		})
		.then(() => console.log(`Answer for ${clientId} was created.`))
		.then(() => rtcConnection)
		
	}
	
	/**
	 * @description нам пришёл ответный answer на наш offer. Устанавливаем свзязь
	 * */
	static async applyAnswer(peerConnection: RTCPeerConnection,clientId: string, answer: RTCSessionDescription ) {
		return peerConnection.setRemoteDescription(answer)
		.then(() => {
			console.log(`Answer was applied from ${clientId}`);
			
			return peerConnection;
		})
	}
	
	
	static addCandidate(peer: RTCPeerConnection, clientId: string, candidate: RTCIceCandidate) {
		return peer.addIceCandidate(candidate)
		.then(() => {
			console.log(`New candidate ${clientId}`);
			return peer;
		})
	}
	
	static newPeerConnection(socket: any, tracks: MediaStreamTrack[], clientId: string, handleTrack: any, stream :any): RTCConnection {
		
		return new RTCConnection({
			tracks, clientId, handleTrack, emit: socket.emit.bind(socket), stream
		})

	}
	
	static endConnection(peer: RTCPeerConnection, clientId: string) {
		console.log(`Connection with ${clientId} closed`);
		peer.close();
	}
	
	
}
