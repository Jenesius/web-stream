import RTCConnection from "../connections/rtc-connection";
import RTCTrack from "../rtc-track";

export default class PeerService {
	
	static CONFIGURATION = {}
	
	static EVENT_CANDIDATE = 'peer:candidate';
	static EVENT_OFFER = 'peer:offer';
	static EVENT_REMOVE_TRACK = 'peer:remove-track';
	
	/**
	 * Возвращает peer connection с пользователем
	 * */
	static async createOffer(socket: any, rtcConnection: RTCConnection) {

		const offer = await rtcConnection.createOffer();
		const clientId = rtcConnection.clientId;

		//const mediaBinding = rtcConnection.getMediaBinding();
		
		socket.emit(PeerService.EVENT_OFFER, { offer, clientId});
		
		return rtcConnection;
	}
	
	/**
	 * @description Когда нам отправили offer, мы регистрируем peerConnection по
	 * дписываем полученный offer и отправляем answer обратно пользователю.
	 * */
	static async createAnswer(socket: any, tracks: MediaStreamTrack[], clientId: string, offer: RTCSessionDescription) {
		const rtcConnection = PeerService.newPeerConnection(tracks, clientId);
		
		const pc = rtcConnection.peerConnection;
		
		return pc.setRemoteDescription(offer)
		.then(() => pc.createAnswer())
		.then(answer => {
			//console.log(`[peer-service] create answer`, answer);
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
	
	static removeTrack(socket: any, trackId: string) {
		socket.emit(PeerService.EVENT_REMOVE_TRACK, trackId);
	}
	
}
