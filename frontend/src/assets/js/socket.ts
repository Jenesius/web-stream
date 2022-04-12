import {io, Socket as test} from "socket.io-client";
import {Callback} from "@/assets/js/event-emitter";

export default class Socket{
	_socket: test
	get socket() {
		return this._socket;
	}
	
	on(eventName: string, callback: Callback) {
		this._socket.on(eventName, callback);
	}
	
	off(eventName: string, callback: Callback) {
		this._socket.off(eventName, callback);
	}
	emit(eventName: string, payload?: any) {
		this._socket.emit(eventName, payload);
	}
	
	constructor(namespace = '') {
		let url = `wss://${document.location.host}` + '/' + namespace;
		

		if (process.env.NODE_ENV !== 'production')
		url = 'ws://localhost:3333' +'/' + namespace;
		
		const socket = this._socket = io( url, {
			transports: ['websocket']
		})
		
		// client-side
		socket.on("connect", () => {
			//console.log(`Connect. User id: %c${this.socket.id}`, 'color: blue' );
		});
		
		socket.on('connect_error', (err:any) => {
			console.log('Connection Error:', err);
		})
		
		socket.on('error', (err:any) => {
			console.warn('Socket handle error', err);
		})
		
	}
	
}
