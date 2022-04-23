import EventEmitter, {Callback} from "jenesius-event-emitter";
import useSocket from "@/assets/js/use-socket/use-socket";
import {Socket} from "socket.io-client";
import makeId from "@/assets/js/make-id";


/**
 * Singleton class. Используется для взаимодействия между подключениями.
 * */

class _SignalingChannel extends EventEmitter{

	static EVENT_MESSAGE = 'message';
	static GET_EVENT_NAME(clientId: string) {
		return _SignalingChannel.EVENT_MESSAGE + ':' + clientId;
	}
	
	socket: Socket
	

	constructor() {
		super();


		
		this.socket = useSocket({namespace: 'signals'});
		this.socket.on('connect', () => {
			this.msg(`connected`);
		})
		this.socket.on('message', (data: IMessage) => {
			
			if (!data.sender) return console.log('sender not included.');
			const strConnect = data.sender;
			
			this.emit(_SignalingChannel.GET_EVENT_NAME(strConnect), data);
		})
		

		

	}
	
	onmessage(strConnect: string, callback: Callback) {
		
		return this.on(_SignalingChannel.GET_EVENT_NAME(strConnect), callback);
	}
	
	send(params: IMessage) {
		
		// @ts-ignore
		params.sender = window.userId;
		
		this.socket.emit('message', params);
	}
	
	msg(msg: string) {
		console.log(`[%csignaling-channel%c] ${msg}`, 'color: green', 'color:black');
	}

}
interface IMessage {
	description?: RTCSessionDescription | null,
	recipient: string, // Получатель, кому отправили,
	sender?: string,
	candidate?: RTCIceCandidate | null
}

const SignalingChannel = new _SignalingChannel();
export default SignalingChannel
