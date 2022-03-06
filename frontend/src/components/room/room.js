import React from "react";
import "./room.css";

import Socket from "../../assets/js/sockets/Socket";

export default class Room extends React.Component {

	constructor(props) {
		super(props);
		
		this.handleJoin = this.handleJoin.bind(this);
	}


	
	componentDidMount() {
		let conf = {
			iceServers: [
				{
					urls: 'stun:stun4.l.google.com:19302'
				},
				{
					urls: 'turn:numb.viagenie.ca:3478',
					credential: 'jenesius1998',
					username: 'lokargenia@gmail.com'
				},

			]
		}
		conf = {};
		
		this.socket = new Socket('peers');
		this.peers = {};
		
		window.peers = this.peers;
		
		// Создание peer(Мы инициаторы)
		this.socket.on('peer:new-offer', data => {
			const {clientId} = data
			console.log(`Создаём новый offer. ${clientId}`, '-->');
			

			
			const pc = this.peers[clientId] = new RTCPeerConnection(conf);
			
			pc.onicecandidate = e => {
				console.log(pc.localDescription);
			}
			pc.onicecandidateerror = e => {
				console.log('Error', e);
			}
			
			
			const channel = pc.createDataChannel(`test-${clientId}`);
			channel.onopen = e => {
				console.log(`Channel opened with ${clientId}`);
			}
			channel.onmessage = e => {
				console.log(`From ${clientId}: `, e.data);
			}
			
			pc.createOffer()
			.then(offer => pc.setLocalDescription(offer))
			.then(() => console.log('Offer:', pc.localDescription))
			.then(() => this.socket.emit('peer:offer', {
				offer: pc.localDescription,
				clientId
			}))
			.then(() => {
				
				console.log('Offer created.', JSON.stringify(pc.localDescription))
				
			})
			
		})
		
		// Создание peer(Мы отвечаем)
		this.socket.on('peer:offer', data => {
			
			
			const {offer, clientId} = data
			console.log('Отвечем на offer', '<--', '-->')

			
			const pc = this.peers[clientId] = new RTCPeerConnection(conf);
			
			pc.onicecandidate = e => {
				console.log(pc.localDescription);
			}
			pc.onicecandidateerror = e => {
				console.log('Error', e);
			}
			
			pc.ondatachannel = e => {
				
				pc.channel = e.channel;
				
				pc.channel.onopen = e => {
					console.log('Channel opened with', clientId)
				}
				pc.channel.onmessage = e => {
					clientId.log(`From ${clientId}:`, e.data);
				}
				
			}
			
			pc.setRemoteDescription(offer)
			.then(() => pc.createAnswer())
			.then(answer => pc.setLocalDescription(answer))
			.then(() => this.socket.emit('peer:answer', {
				answer: pc.localDescription,
				clientId
			}))
			.then(() => {
				
				console.log('set remote', offer);
				console.log('create local', pc.localDescription);
				
				
			})
			
		})
		

		// Подтверждаем звонок
		this.socket.on('peer:answer', data => {
			
			const {answer, clientId} = data;
			
			console.log('Подписываем ответ');
			
			this.peers[clientId].setRemoteDescription(answer)
			.then(() => {
				console.log('Seted remote', answer);
			})
		})

		
		
	}
	componentWillUnmount() {

	}

	handleJoin(){
		
		this.socket.emit('peer:join');
		
	}

	
	render(){
		
		return (
			<div>
			
				<p>Welcome</p>
			
				<button onClick={this.handleJoin}>join peer</button>
			
			</div>
		)
		
	}
}
