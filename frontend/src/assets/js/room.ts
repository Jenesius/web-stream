import {Socket} from "socket.io-client";
import EventEmitter from "./event-emitter";

import RTCConnection from "./rtc-connection";

import {MediaManager} from "./media-manager";
import {UserConnectionInfo} from "@/assets/js/types/user-types";
import useSocket from "@/assets/js/use-socket/use-socket";
import makeId from "@/assets/js/make-id";

export default class Room extends EventEmitter{
	
	
	socket: Socket
	connections: {
		[name: string]: RTCConnection
	} = new Proxy({}, {
			set: (target: Room["connections"], p: string, value) => {
		
		// Закрываем соединение с предыдущим peer
		if (p in target) target[p].close();
		target[p] = value;
		
		
		return true;
	},
	deleteProperty: (target, p: string) => {
		
		if (p in target) target[p].close();
		
		delete target[p];
		this.emit('update');
		
		return true;
	}
	});

	/**
	 * Хранит информацию пользователей в комнате.
	 * */
	users: {
		[name: string]: UserConnectionInfo
	} = {}
	userInfo: UserConnectionInfo
	
	
	constructor({userInfo}: {userInfo: UserConnectionInfo}) {
		super();
		this.socket = useSocket({namespace: 'rooms'});
		
		this.join();

		this.userInfo = userInfo;
		

	}
	
	// Подключение к комнате
	private join() {

		this.socket.on('connect', () => {
			this.socket.emit('room:join', {roomId: 1});
		})
		
		// При получении списка пользователей
		this.socket.on('room:users', (data: {connectionId: string}[]) => {
			data.forEach(({connectionId}) => {
				this.connectTo(connectionId); // резервирование соединения
				this.socket.emit('room:connect', connectionId); // просим создать обратное подключение
			})
		})
		
		// При кодключении пользователя
		this.socket.on('room:connect', connectionId => {
			this.connectTo(connectionId)
		})
		
		/*
		this.socket.on('room:new-connection', (data: {userId: string}) => {
			const userId = data.userId;
			this.msg(`new connection ${userId}`)
			this.connectTo(userId);
			
			this.socket.emit('room:new-connection-reserved', {userId});
		})
		this.socket.on('room:new-connection-reserved', (data: {userId: string}) => {
			const userId = data.userId;
			this.msg(`new-connection-reserved ${userId}`)
			this.connectTo(userId);
		})
		*/
		this.socket.on('room:user-leave', this.removeConnect.bind(this));

	}
	
	addUser(rtcConnection: RTCConnection){
		const clientId:string = rtcConnection.clientId;
		this.connections[clientId] = rtcConnection;
		this.emit('update');
	}
	removeUser(clientId: string) {
		delete this.connections[clientId];
		this.emit('update');
	}
	
	/**
	 * @description Создание нового P2P соединиения с пользователем clientId
	 * */
	private addConnection(clientId: string, polite: boolean) {
		
		const rtcConnection = new RTCConnection({
			clientId, tracks: this.getTracks(), polite
		})
		this.connections[clientId] = rtcConnection;
		
	}
	
	
	removeConnect({clientId}: {clientId: string}) {
		this.removeUser(clientId);
	}
	
	/**
	 * TEST methods
	 * */
	private getTracks(): MediaStreamTrack[] {
		return MediaManager.getTracks();
	}
	
	async recall(){

		Object.values(this.connections).forEach(elem => this.connectTo(elem.clientId));
		
		return;
		
	}
	/**
	 * Метод вызывается, когда нам нужно позвонить пользователю. В данном случае
	 * мы являемся инициаторами
	 * */
	connectTo(clientId: string) {
		
		const connection = this.getConnection(clientId);
		
		if (!connection || connection.closed) return this.addConnection(clientId, true);
		
		connection.updateTracks(this.getTracks());
		console.log('Offer на уже устанолвенный коннект')
	}


	getUserInfo(clientId: string) {
		return this.users[clientId];
	}
	

	
	private getConnection(clientId: string) {
		return this.connections[clientId];
	}
	
	/**
	 * @description Покинуть комнату.
	 * Должно удалить все подключения
	 * */
	leave() {
		this.socket.emit('room:leave');
		this.socket.close();
		Object.values(this.connections).forEach(connection => connection.close())
	}
	msg(msg: string) {
		console.log(`[%croom%c] ${msg}`, 'color: green', 'color: black');
	}
}

