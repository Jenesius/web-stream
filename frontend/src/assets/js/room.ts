import Socket from "./socket";
import EventEmitter from "./event-emitter";
import PeerService
	from "./peer-service";
import RTCConnection from "./rtc-connection";

import AudioSystem from "./audio-system";
import {MediaManager} from "./media-manager";

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

	
	
	constructor() {
		super();
		this.socket = new Socket('peers');
		this.socket.emit('peer:join');
		
		this.join();

	}
	
	// Подключение к комнате
	private join() {
		this.socket.on('peer:new-offer', this.connectTo.bind(this)); // create offer
		
		this.socket.on('peer:candidate', this.onCandidate.bind(this));
		
		this.socket.on('peer:offer', this.onConnect.bind(this)); //Create answer
		
		this.socket.on('peer:answer', this.onAnswer.bind(this));
		
		this.socket.on('peer:user-leave', this.removeConnect.bind(this));
		
		this.socket.on('peer:remove-track', ({clientId, trackId}: any) => {
			
			const connection = this.getConnection(clientId);
			
			if (!connection || connection.closed) return;
			
			connection.removeRemoteTrack(trackId);
			
		})
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
	private async addConnection(clientId: string) {
		const rc = await this.createNewConnection(clientId);
		
		await PeerService.createOffer(this.socket, rc);
	}
	
	private async createNewConnection(clientId: string){
		
		const rtcConnection = new RTCConnection({
			clientId, tracks: this.getTracks()
		})
		
		this.initializeRtcConnection(rtcConnection);
		
		return rtcConnection;
	}
	
	
	async onCandidate({candidate, clientId}: {candidate: any, clientId: string}){
		
		if (this.connections[clientId])
			await PeerService.addCandidate(this.connections[clientId], candidate);
	}
	
	async createAnswer({offer, clientId}: {offer: any, clientId: any}) {

		const rtcConnection = await
			PeerService.createAnswer(this.socket, this.getTracks(), clientId, offer);
		
		this.initializeRtcConnection(rtcConnection);
		
	}
	
	private initializeRtcConnection(rtcConnection: RTCConnection) {
		const clientId = rtcConnection.clientId;
		
		rtcConnection.on(RTCConnection.EVENT_ON_ICE_CANDIDATE, candidate => {
			this.socket.emit('peer:candidate', {clientId, candidate})
		})

		
		rtcConnection.on(RTCConnection.EVENT_TRACKS_UPDATE, () => {
			const a = rtcConnection.tracks.filter(track => track.kind === 'audio')
			
			a.forEach(t => AudioSystem.addTrack(t))
		})
		
		
		rtcConnection.on(RTCConnection.EVENT_NEGOTIATION_CONNECTION, async () => {
			const offer = await rtcConnection.createOffer();
			const clientId = rtcConnection.clientId;
			
			this.socket.emit(PeerService.EVENT_OFFER, { offer, clientId });
		})
		
		rtcConnection.on(RTCConnection.EVENT_REMOVE_TRACK, trackId => {
			PeerService.removeTrack(this.socket, trackId);
		})
		
		const a = rtcConnection.tracks.filter(track => track.kind === 'audio')
		
		a.forEach(t => AudioSystem.addTrack(t))
		
		
		
		this.addUser(rtcConnection);
	}
	
	
	removeConnect({clientId}: {clientId: string}) {
		PeerService.endConnection(this.connections[clientId]);
		this.removeUser(clientId);
	}
	
	/**
	 * TEST methods
	 * */
	private getTracks(): MediaStreamTrack[] {
		return MediaManager.getTracks();
	}
	
	async recall(){

		Object.values(this.connections).forEach(elem => this.connectTo(elem));
		
		return;
		
	}
	/**
	 * CONNECT TO
	 * Мы являемся инициаторами
	 * */
	connectTo({clientId}: {clientId: string}) {
		const connection = this.getConnection(clientId);
		
		if (!connection || connection.closed) return this.addConnection(clientId);
		
		connection.updateTracks(this.getTracks());
	}

	
	private async onConnect(data: {offer: RTCSessionDescription, clientId: string}) {
		const clientId = data.clientId;
		const connection = this.getConnection(clientId);
		
		if (!connection || connection.closed) return this.createAnswer(data);
		
		const answer = await connection.createAnswer(data.offer);
		this.socket.emit('peer:answer', { answer, clientId })
	}
	
	private async onAnswer(data: {answer: RTCSessionDescription, clientId: string}) {
		
		const clientId = data.clientId;
		const answer   = data.answer;
		
		await PeerService.applyAnswer(this.connections[clientId], answer);
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
		Object.values(this.connections).forEach(connection => connection.close())
	}
	
}

