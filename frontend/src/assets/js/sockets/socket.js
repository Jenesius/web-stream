import {io} from "socket.io-client";

export default class Socket{
	get socket() {
		return this._socket;
	}
	
	on(eventName, callback) {
		this._socket.on(eventName, callback);
	}
	
	off(eventName, callback) {
		this._socket.off(eventName, callback);
	}
	emit(eventName, payload) {
		this._socket.emit(eventName, payload);
	}
	
	constructor(namespace = '') {
		
		
		let socket = this._socket = io(
			process.env.REACT_APP_BACKEND_SOCKET_URL + '/' + namespace, {
			transports: ['websocket']
		})
		
		// client-side
		socket.on("connect", () => {
			console.log(`Connect. User id: %c${this.socket.id}`, 'color: blue' );
		});
		
		socket.on('connect_error', err => {
			console.log('Connection Error:', err);
		})
		
		socket.on('error', err => {
			console.warn('Socket handle error', err);
		})
		
	}
	
}
