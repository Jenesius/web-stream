import Socket from "../sockets/Socket";
import EventEmitter from "../event-emitter/EventEmitter.ts";
import PeerConnectionService
	from "../adapter-peer-connection/peer-connection-service.ts";

export default class Room extends EventEmitter{
	
	constructor() {
		super();
		this.socket = new Socket('peers');
		this.socket.emit('peer:join');
		this.peers = new Proxy({}, {
			set: (target, p, value) => {
				
				target[p] = value;
				
				this.emit('update');
				
				return true;
			},
			deleteProperty: (target, p) => {
				
				delete target[p];
				this.emit('update');
				
				return true;
			}
		});
		
		this.socket.on('peer:new-offer', this.createNewOffer.bind(this));
		
		this.socket.on('peer:candidate', this.onCandidate.bind(this));
		
		this.socket.on('peer:offer', this.createAnswer.bind(this));
		
		this.socket.on('peer:answer', this.acceptCall.bind(this));
		
		this.socket.on('peer:user-leave', this.removeConnect.bind(this));
		
		this.users = new Proxy({}, {
			set: (target, p, value) => {
				
				target[p] = value;
				
				this.emit('update');
				
				return true;
			},
			deleteProperty: (target, p) => {
				
				delete target[p];
				this.emit('update');
				
				return true;
			}
		});
	}
	
	setPeer(clientId, peer) {
		if (!this.users[clientId]) this.users[clientId] = {clientId};
		this.users[clientId].peer = peer;
	}
	getPeer(clientId) {
		return this.users[clientId]?.peerConnection;
	}
	removeUser(clientId) {
		delete this.users[clientId];
	}
	
	handleTrack(clientId, e) {
		console.log(`%cHandle track ${clientId}`, 'color: red', e);
		this.users[clientId].stream = e.streams[0];
		this.emit('update');
		
		
	}
	
	async createNewOffer({clientId}){
		
		const tracks = this.getTracks();
		console.log('Tracks', tracks);
		const rtcConnection = await
			PeerConnectionService.createOffer(this.socket, tracks, clientId, e => this.handleTrack(clientId, e), this.stream);
		

		this.users[clientId] = rtcConnection;
	}
	
	async onCandidate({candidate, clientId}){
		
		await PeerConnectionService.addCandidate(this.getPeer(clientId), clientId, candidate);
	}
	
	async createAnswer({offer, clientId}) {

		const rtcConnection = await
			PeerConnectionService.createAnswer(this.socket, this.getTracks(), clientId, offer, (e) => this.handleTrack(clientId, e), this.stream);
		
		this.users[clientId] = rtcConnection;
		
	}
	
	async acceptCall({answer, clientId}){
		await PeerConnectionService.applyAnswer(this.getPeer(clientId), clientId, answer);
	}
	
	removeConnect({clientId}) {
		PeerConnectionService.endConnection(this.getPeer(clientId), clientId);
		this.removeUser(clientId);
	}
	
	/**
	 * TEST methods
	 * */
	getTracks(){
		return this.stream?.getTracks() || []
	}
	
	async recall(constrains){
		
		console.log('++');
		
		this.stream = await navigator.mediaDevices.getUserMedia(constrains);
		
		Object.values(this.users).forEach(elem => this.createNewOffer(elem));
		
		return;
		/*
		for (const track of gumStream.getTracks()) {
			
			Object.values(window.room.peers).forEach(user => {
				
				user.peer.addTrack(track);
			})
		}*/
		
	}
	
}
