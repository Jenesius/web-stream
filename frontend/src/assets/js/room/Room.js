import Socket from "../sockets/Socket";
import EventEmitter from "../event-emitter/EventEmitter";

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
		
	}
	
	createNewOffer({clientId}){

		console.log(`Создание нового offer для %c${clientId}`, 'color: blue');
		
		const pc = new RTCPeerConnection({});
		
		if (this.stream)
		this.stream.getTracks().forEach(track => {
			pc.addTrack(track, this.stream);
			

			
			console.log(`Добавление дорожки к ${clientId}`)
		});
		
		this.peers[clientId] = {
			peer: pc,
			clientId
		}
		
		pc.onicecandidate = e => {
			this.socket.emit('peer:candidate', {
				candidate: e.candidate,
				clientId
			})
		}
		
		// При получении данных
		pc.ontrack = (ev) => {
			console.log('STREAM!', ev.streams);

			/*
			if (ev.streams && ev.streams[0]) {
				this.video.srcObject = ev.streams[0];
			} else {
				console.log('else')
			}
			
			 */
		};
		
		// Тест
		const channel = pc.channel= pc.createDataChannel(`test-${clientId}`);
		channel.onopen = e => {
			console.log(`Channel opened with %c${clientId}`, 'color: purple');
		}
		channel.onmessage = e => {
			console.log(`From ${clientId}: `, e.data);
		}
		
		pc.createOffer()
		.then(offer => pc.setLocalDescription(offer))
		.then(() => this.socket.emit('peer:offer', {
			offer: pc.localDescription,
			clientId
		}))
		
	}
	
	onCandidate(data){
		const {candidate, clientId} = data;
		
		this.peers[clientId].peer.addIceCandidate(candidate)
		.then(() => {
			console.log('Candidate add +')
		})
		.catch(err => {
			console.log('Candiadte adding ERROR', err);
		})
	}
	
	createAnswer(data) {
		const {offer, clientId} = data;
		console.log(`Отвечем на offer от %c${clientId}`, 'color: green')
		
		
		const pc =  new RTCPeerConnection({});
		if (this.streams)
		this.streams.getTracks().forEach(track => pc.addTrack(track));
		this.peers[clientId] = {
			peer: pc,
			clientId
		}
		
		pc.onicecandidate = e => {
			this.socket.emit('peer:candidate', {
				candidate: e.candidate,
				clientId
			})
		}
		pc.ontrack = (ev) => {
			console.log('STREAM!', ev);
			console.log('STREAM!', ev.streams);
			this.emit('update');
			this.peers[clientId].stream = ev.streams[0];
			
			/*
			if (ev.streams && ev.streams[0]) {
				this.video.srcObject = ev.streams[0];
			} else {
				console.log('else')
			}
			
			 */
		};
		
		pc.onicecandidateerror = e => {
			console.log('Error', e);
		}
		
		pc.ondatachannel = e => {
			pc.channel = e.channel;
			
			pc.channel.onopen = e => {
				console.log(`Channel opened with %c${clientId}`, 'color: purple')
			}
			pc.channel.onmessage = e => {
				console.log(`From ${clientId}:`, e.data);
			}
		}
		
		pc.setRemoteDescription(offer)
		.then(() => pc.createAnswer())
		.then(answer => pc.setLocalDescription(answer))
		.then(() => this.socket.emit('peer:answer', {
			answer: pc.localDescription,
			clientId
		}))
	}
	
	acceptCall(data){
		const {answer, clientId} = data;
		
		console.log(`Подписываем answer для %c${clientId}`, 'color: green');
		
		this.peers[clientId].peer.setRemoteDescription(answer)
	}
	
	removeConnect(data) {
		const {clientId} = data;
		
		this.peers[clientId]?.peer.close()
		delete this.peers[clientId];
	}
	
	async recall(constrains){
		this.stream = await navigator.mediaDevices.getUserMedia(constrains);
		
		Object.values(this.peers).forEach(elem => this.createNewOffer(elem));
		
		return;
		/*
		for (const track of gumStream.getTracks()) {
			
			Object.values(window.room.peers).forEach(user => {
				
				user.peer.addTrack(track);
			})
		}*/
		
	}
	
}
