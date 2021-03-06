import {Server, Socket} from "socket.io";

export default function (io: Server) {
	
	
	const peers:{[name: string]: Socket} = {};
	
	io.of('/peers').on('connection', socket => {
		
		const ROOM_NAME = 'test';
		
		/**
		 * 1. Пользователь подключается к комнате
		 * 2. Просим всех пользователей данной комнаты позвонить ему
		 *
		 * */
		socket.on('peer:join', (() => {
			
			socket.join(ROOM_NAME); // Join test room
			
			// Просим создать offer для clientId
			socket.broadcast.to(ROOM_NAME).emit('peer:new-offer', {
				clientId: socket.id
			})
			
			peers[socket.id] = socket; // [TEST] подсоединяем в пирам
		}))
		
		
		/**
		 * Передача цели offer'a
		 * Клиент должен его установить в setRemoteDescription
		 * */
		socket.on('peer:offer', data => {
			const {offer, clientId, credentials, userInfo} = data;
			
			peers[clientId]?.emit('peer:offer', {offer, clientId: socket.id, credentials, userInfo});
		})
		
		socket.on('peer:candidate', data => {
			const {candidate, clientId} = data;
			
			peers[clientId]?.emit('peer:candidate', {candidate, clientId: socket.id})
			
		})
		
		socket.on('peer:answer', data => {
			
			const {answer, clientId, userInfo} = data;
			
			peers[clientId]?.emit('peer:answer', {answer, clientId: socket.id, userInfo})
			
		})
		
		socket.on('peer:remove-track', trackId => {
			
			socket.broadcast.to(ROOM_NAME).emit('peer:remove-track', {
				clientId: socket.id,
				trackId
			})
			
		})
		
		socket.on('disconnect', () => {
			
			delete peers[socket.id];
			
			socket.broadcast.to(ROOM_NAME).emit('peer:user-leave', {
				clientId: socket.id
			})
			
		})
		
	})
	
}
