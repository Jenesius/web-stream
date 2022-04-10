import Socket from "../sockets/socket";
import EventEmitter from "../event-emitter/event-emitter";
import PeerConnectionService
	from "../adapter-peer-connection/peer-connection-service";
import RTCConnection from "../connections/rtc-connection";

import AudioSystem from "./../audio-system/audio-system";

export default class Room extends EventEmitter{
	
	socket: Socket
	users: {
		[name: string]: RTCConnection
	}
	
	
	
	constructor() {
		super();
		this.socket = new Socket('peers');
		this.socket.emit('peer:join');
		
		this.socket.on('peer:new-offer', this.connect.bind(this)); // create offer
		
		this.socket.on('peer:candidate', this.onCandidate.bind(this));
		
		this.socket.on('peer:offer', this.join.bind(this)); //Create answer
		
		this.socket.on('peer:answer', this.acceptCall.bind(this));
		
		this.socket.on('peer:user-leave', this.removeConnect.bind(this));
		
		this.socket.on('peer:remove-track', ({clientId, trackId}: any) => {
			
			const connection = this.getConnection(clientId);
			
			if (!connection || connection.closed) return;
			
			connection.removeRemoteTrack(trackId);
			
		})
		
		this.users = new Proxy({}, {
			set: (target: Room["users"], p: string, value) => {
				
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
	}
	
	
	addUser(rtcConnection: RTCConnection){
		const clientId:string = rtcConnection.clientId;
		this.users[clientId] = rtcConnection;
		this.emit('update');
	}
	removeUser(clientId: string) {
		delete this.users[clientId];
		this.emit('update');
	}
	
	async createNewOffer({clientId}: {clientId: string}){
		
		const rtcConnection = await
			PeerConnectionService.createOffer(this.socket, this.getTracks(), clientId);
		
		this.initializeRtcConnection(rtcConnection);
	}
	
	async onCandidate({candidate, clientId}: {candidate: any, clientId: string}){
		
		if (this.users[clientId])
			await PeerConnectionService.addCandidate(this.users[clientId], candidate);
	}
	
	async createAnswer({offer, clientId}: {offer: any, clientId: any}) {

		const rtcConnection = await
			PeerConnectionService.createAnswer(this.socket, this.getTracks(), clientId, offer);
		
		this.initializeRtcConnection(rtcConnection);
		
	}
	
	private initializeRtcConnection(rtcConnection: RTCConnection) {
		const clientId = rtcConnection.clientId;
		
		rtcConnection.on(RTCConnection.EVENT_ON_ICE_CANDIDATE, candidate => {
			this.socket.emit('peer:candidate', {clientId, candidate})
		})

		
		rtcConnection.on(RTCConnection.EVENT_TRACKS_UPDATE, () => {
			let a = rtcConnection.tracks.filter(track => track.kind === 'audio')
			
			a.forEach(t => AudioSystem.addTrack(t))
		})
		
		
		rtcConnection.on(RTCConnection.EVENT_NEGOTIATION_CONNECTION, async () => {
			const offer = await rtcConnection.createOffer();
			const clientId = rtcConnection.clientId;
			
			this.socket.emit(PeerConnectionService.EVENT_OFFER, { offer, clientId });
		})
		
		rtcConnection.on(RTCConnection.EVENT_REMOVE_TRACK, trackId => {
			PeerConnectionService.removeTrack(this.socket, trackId);
		})
		
		let a = rtcConnection.tracks.filter(track => track.kind === 'audio')
		
		a.forEach(t => AudioSystem.addTrack(t))
		
		
		
		this.addUser(rtcConnection);
	}
	
	async acceptCall({answer, clientId}: {answer: any, clientId: string}){
		await PeerConnectionService.applyAnswer(this.users[clientId], answer);
	}
	
	removeConnect({clientId}: {clientId: string}) {
		PeerConnectionService.endConnection(this.users[clientId]);
		this.removeUser(clientId);
	}
	
	/**
	 * TEST methods
	 * */
	
	tracks: MediaStreamTrack[] = []
	
	getTracks(){
		console.log('[room] provided tracks', this.tracks);
		return this.tracks;
	}
	
	async recall(tracks:MediaStreamTrack[]){

		this.tracks = tracks;
		//document.getElementById('test').srcObject = this.stream;

		Object.values(this.users).forEach(elem => this.connect(elem));
		
		return;
		
	}
	/**
	 * CONNECT TO
	 * Мы являемся инициаторами
	 * */
	connect({clientId}: {clientId: string}) {
		const connection = this.getConnection(clientId);
		
		if (!connection || connection.closed) return this.createNewOffer({clientId});
		
		connection.updateTracks(this.tracks);
	}
	async join(data: {clientId: string, offer: any}) {
		
		const clientId = data.clientId;
		
		const connection = this.getConnection(clientId);
		if (!connection || connection.closed) return this.createAnswer(data);
		
		const answer = await connection.createAnswer(data.offer);
		this.socket.emit('peer:answer', { answer, clientId })
	}
	

	
	private getConnection(clientId: string) {
		return this.users[clientId];
	}
	
}
