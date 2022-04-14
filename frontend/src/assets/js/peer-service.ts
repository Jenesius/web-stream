import RTCConnection from "./rtc-connection";
import Room from "@/assets/js/room";
import Socket from "@/assets/js/socket";
import {UserConnectionInfo} from "@/assets/js/types/user-types";

export default class PeerService {
	
	static CONFIGURATION = {}
	
	static EVENT_CANDIDATE = 'peer:candidate';
	static EVENT_OFFER = 'peer:offer';
	static EVENT_REMOVE_TRACK = 'peer:remove-track';
	
	/**
	 * Возвращает peer connection с пользователем
	 * */
	static async createOffer(room: Room, rtcConnection: RTCConnection) {

		const offer = await rtcConnection.createOffer();
		const clientId = rtcConnection.clientId;

		//const mediaBinding = rtcConnection.getMediaBinding();
		
		room.socket.emit(PeerService.EVENT_OFFER, { offer, clientId, userInfo: room.userInfo});
		
		return rtcConnection;
	}
	
	/**
	 * @description Когда нам отправили offer, мы регистрируем peerConnection по
	 * дписываем полученный offer и отправляем answer обратно пользователю.
	 * */
	static async createAnswer({socket, tracks, clientId, offer, userInfo}: CreateAnswerParams) {
		const rtcConnection = PeerService.newPeerConnection(tracks, clientId);
		
		await rtcConnection.createAnswer(offer)
		.then(answer => {
			socket.emit('peer:answer', { answer, clientId, userInfo })
		})
		
		return  rtcConnection;
		
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

interface CreateAnswerParams {
	socket: Socket,
	tracks: MediaStreamTrack[],
	clientId: string,
	offer: RTCSessionDescription,
	userInfo: UserConnectionInfo
}
