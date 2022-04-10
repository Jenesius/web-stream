import RTCConnection from "../connections/rtc-connection";

export default class PeerConnectionService {
	
	static CONFIGURATION = {}
	
	static EVENT_CANDIDATE = 'peer:candidate';
	static EVENT_OFFER = 'peer:offer';
	
	/**
	 * Возвращает peer connection с пользователем
	 * */
	static async createOffer(socket: any, tracks: MediaStreamTrack[], clientId: string): Promise<RTCConnection> {
		const rtcConnection = PeerConnectionService.newPeerConnection(tracks, clientId);
		
		const pc = rtcConnection.peerConnection
		
		return pc.createOffer({
			offerToReceiveAudio: true,
			offerToReceiveVideo: true
		})
		.then(offer => {
			console.log(`[peer-service] create offer`, offer);
			return offer;
		})
		.then(offer => pc.setLocalDescription(offer))
		.then(() => {
			const offer = pc.localDescription;
			socket.emit(PeerConnectionService.EVENT_OFFER, { offer, clientId });
		})
		//.then(() => console.log(`Offer for ${clientId} was created.`))
		.then(() => rtcConnection)
	}
	
	/**
	 * @description Когда нам отправили offer, мы регистрируем peerConnection по
	 * дписываем полученный offer и отправляем answer обратно пользователю.
	 * */
	static async createAnswer(socket: any, tracks: MediaStreamTrack[], clientId: string, offer: RTCSessionDescription) {
		const rtcConnection = PeerConnectionService.newPeerConnection(tracks, clientId);
		
		const pc = rtcConnection.peerConnection;
		
		return pc.setRemoteDescription(offer)
		.then(() => pc.createAnswer())
		.then(answer => {
			console.log(`[peer-service] create answer`, answer);
			return answer;
		})
		.then(answer => pc.setLocalDescription(answer))
		.then(() => {
			const answer = pc.localDescription;
			socket.emit('peer:answer', { answer, clientId })
		})
		//.then(() => console.log(`Answer for ${clientId} was created.`))
		.then(() => rtcConnection)
		
	}
	
	/**
	 * @description нам пришёл ответный answer на наш offer. Устанавливаем свзязь
	 * */
	static async applyAnswer(rtcConnection: RTCConnection, answer: RTCSessionDescription ) {
		return rtcConnection.peerConnection.setRemoteDescription(answer)

	}
	
	
	static addCandidate(rtcConnection: RTCConnection,  candidate: RTCIceCandidate) {
		return rtcConnection.peerConnection.addIceCandidate(candidate)
	}
	
	static newPeerConnection(tracks: MediaStreamTrack[], clientId: string): RTCConnection {
		
		return new RTCConnection({
			tracks, clientId
		})

	}
	
	static endConnection(rtcConnection: RTCConnection) {
		console.log(`Connection with ${rtcConnection.clientId} closed`);
		rtcConnection.peerConnection.close();
	}
	
	
}
