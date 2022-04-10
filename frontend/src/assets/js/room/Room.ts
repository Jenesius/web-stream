import Socket from "../sockets/socket";
import EventEmitter from "../event-emitter/event-emitter";
import PeerConnectionService
	from "../adapter-peer-connection/peer-connection-service";
import RTCConnection from "../connections/rtc-connection";

export default class Room extends EventEmitter{
	
	socket: Socket
	users: {
		[name: string]: RTCConnection
	}
	
	
	
	constructor() {
		super();
		this.socket = new Socket('peers');
		this.socket.emit('peer:join');
		
		this.socket.on('peer:new-offer', this.createNewOffer.bind(this));
		
		this.socket.on('peer:candidate', this.onCandidate.bind(this));
		
		this.socket.on('peer:offer', this.createAnswer.bind(this));
		
		this.socket.on('peer:answer', this.acceptCall.bind(this));
		
		this.socket.on('peer:user-leave', this.removeConnect.bind(this));
		
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

		Object.values(this.users).forEach(elem => this.createNewOffer(elem));
		
		return;
		
	}
	
}
