import React, {useEffect, useState} from "react";
import "./room.css";

import Socket from "../../assets/js/sockets/Socket";
import {useParams} from "react-router-dom";
import Room from "../../assets/js/room/Room";
import UserScreen from "../user-screen/user-screen";


class Room1 extends React.Component {

	constructor(props) {
		super(props);
		
		this.handleJoin = this.handleJoin.bind(this);
		this.handleMessage = this.handleMessage.bind(this);
		this.handleProvideTracks = this.handleProvideTracks.bind(this);
		
		this.video = React.createRef();
		
	}


	
	componentDidMount() {
		return;
		let conf = {
			iceServers: [
				{
					urls: "stun:openrelay.metered.ca:80"
				},
				{
					urls: "turn:openrelay.metered.ca:80",
					username: "openrelayproject",
					credential: "openrelayproject"
				},
				{
					urls: "turn:openrelay.metered.ca:443",
					username: "openrelayproject",
					credential: "openrelayproject"
				},
				{
					urls: "turn:openrelay.metered.ca:443?transport=tcp",
					username: "openrelayproject",
					credential: "openrelayproject"
				}
			]
		}
		conf = {};
		
		this.socket = new Socket('peers');
		this.peers = {};
		
		
		// Создание peer(Мы инициаторы)
		this.socket.on('peer:new-offer', data => {
			const {clientId} = data
			console.log(`Создаём новый offer для %c${clientId}`, 'color: blue');
			
			
			const pc = this.peers[clientId] = new RTCPeerConnection(conf);
			
			pc.onicecandidate = e => {
				this.socket.emit('peer:candidate', {
					candidate: e.candidate,
					clientId
				})
			}
			
			pc.ontrack = (ev) => {
				console.log('STREAM!', ev.streams)
				if (ev.streams && ev.streams[0]) {
					this.video.srcObject = ev.streams[0];
				} else {
					console.log('else')
				}
			};
			
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
			
		})
		
		this.socket.on('peer:candidate', data => {
			
			const {candidate, clientId} = data;
			
			this.peers[clientId].addIceCandidate(candidate)
			.then(() => {
				console.log('Candidate add +')
			})
			.catch(err => {
				console.log('Candiadte adding ERROR', err);
			})
			
		})
		
		// Создание peer(Мы отвечаем)
		this.socket.on('peer:offer', data => {
			
			
			const {offer, clientId} = data
			console.log(`Отвечем на offer от %c${clientId}`, 'color: green')

			
			const pc = this.peers[clientId] = new RTCPeerConnection(conf);
			
			pc.onicecandidate = e => {
				this.socket.emit('peer:candidate', {
					candidate: e.candidate,
					clientId
				})
			}
			pc.ontrack = (ev) => {
				console.log('STREAM!', ev.streams)
				if (ev.streams && ev.streams[0]) {
					this.video.srcObject = ev.streams[0];
				} else {
					console.log('else')
				}
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
			
		})
		

		// Подтверждаем звонок
		this.socket.on('peer:answer', data => {
			
			const {answer, clientId} = data;
			
			console.log(`Подписываем answer для %c${clientId}`, 'color: green');
			
			this.peers[clientId].setRemoteDescription(answer)

		})

		this.socket.on('peer:cancel-connection', data => {
			const {clientId} = data;
			
			this.peers[clientId]?.close()
			delete this.peers[clientId];

		})
		
		
	}
	
	
	componentWillUnmount() {

	}
	handleMessage(){
		Object.values(this.peers).forEach(peer => {
			
			peer.channel.send('WELCOME')
			
		})
	}
	handleJoin(){
		
		this.socket.emit('peer:join');
		
	}
	
	async handleProvideTracks(){
		
		const gumStream = await navigator.mediaDevices.getUserMedia(
			{video: true});
		
		for (const track of gumStream.getTracks()) {
			Object.values(this.peers).forEach(pc => {
				
				pc.addTrack(track);
			})
		}
	
	}
	
	render(){
		
		return (
			<div>
			
				<p>Welcome</p>
			
				<button onClick={this.handleJoin}>join peer</button>
			
				<button onClick={this.handleMessage}>Set hi</button>
				
				<button onClick = {this.handleProvideTracks}>Provide video</button>
				
				<video ref = {this.video}/>
				
			</div>
		)
		
	}
}

export function WidgetRoom() {
	
	const {id} = useParams();
	const [count, setCount] = useState(0);
	const [users, setUsers] = useState([]);
	
	let room;
	
	useEffect(() => {

		document.title = `Room ${id}`;
		// 1. Подключение к комнате
		// 2. Подписаться на Звонок / Ответ / New Candidate / Подпись Ответа
		room = new Room();
		room.on('update', () => {
			setUsers(Object.values(room.users));
		})
		window.room = room;
		
		// 3. Новый пользователь N
		// 4. Пользоваель N покинул комнату
		
		// 5. Новое сообщение в чате
		
		
		return () => {
			console.log('Сброс')
			
			// -1. Отключение от комнаты
			
			// -2. Отключение от всех пиров
		}
	}, [id])
	

	/*
	  Изменение конфигурации вызова
	  
	  1. Собщаем в комнату свои новые данные, подписываем, устанавливаем
	   соединение и т.д.
	
	 
	*/
	

	
	async function toggleVideo() {
		window.room.recall({video: true});
		
	}
	
	
	return (
		<div>
			<p>Room with id {id}</p>
			
			<button onClick= {toggleVideo}>Video</button>
			
			
			{
				users.map(user => <UserScreen user = {user} key = {user.clientId} />)
			}
			
		</div>
	)
}
