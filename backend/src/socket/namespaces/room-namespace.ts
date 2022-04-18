import {Server, Socket} from "socket.io";


export default (io: Server) => {


	const users:{
		[name: string]: Socket
	} = {};
	/**
	 * Пользователь создал соединение с room-namespace.
	 * */
	io.of('/rooms').on('connection', socket => {
		
		// При подключении к комнате, сигнализируем всех о новом пользователе
		socket.on('room:join', (data) => {
			try {
				const {roomId, userId} = data;
				

				socket.emit('room:users', Object.keys(users))
				socket.join(roomId);
				socket.broadcast.to(roomId).emit('room:new-connection', {userId});
				
				users[userId] = socket;// Saving socket
				
			} catch (e) {
				console.log(`[room:join]`, e)
			}

		})
		
		socket.on('room:connect', userId => {
			
			// @ts-ignore
			const senderId = Object.entries(users).find(a => a[1].id === socket.id)[0];
			
			// @ts-ignore
			users[userId].emit('room:connect', senderId);
		})
		


		
		socket.on('disconnect', () => {
			
			// @ts-ignore
			const senderId = Object.entries(users).find(a => a[1].id === socket.id)[0];
			delete users[senderId];
			
			/*
			
			socket.broadcast.to(ROOM_NAME).emit('peer:user-leave', {
				clientId: socket.id
			})
			*/
		})
		

	})
	
	io.of('/rooms').adapter.on('leave-room', (room, socketId) => {
		io.to(room).emit('room:user-leave', socketId)
		
	});




}
