import {Server, Socket} from "socket.io";


export default (io: Server) => {


	const users:{
		[name: string]: {
			socket: Socket,
			userId?: string
		}
	} = {};
	
	setInterval(() => {
		//console.log(Object.keys(users).map(a => a.slice(0, 5) ));
	}, 5 * 1000);
	
	/**
	 * Пользователь создал соединение с room-namespace.
	 * */
	io.of('/rooms').on('connection', socket => {
		

		
		// При подключении к комнате, сигнализируем всех о новом пользователе
		socket.on('room:join', (data) => {
			try {
				const globalConnectionId = socket.globalConnectionId;
				
				const {roomId} = data;
				
				const prettyArrayUsers = Object.entries(users).map(elem => ({
					connectionId: elem[0],
					userId: elem[1].userId,
				}));
				socket.join(roomId);
				socket.emit('room:users', prettyArrayUsers);

				//socket.broadcast.to(roomId).emit('room:new-connection', {userId});
				console.log('add connection', globalConnectionId.slice(0, 5) + '...')
				users[globalConnectionId] = {socket};
				
			} catch (e) {
				console.log(`[room:join]`, e)
			}

		})
		
		socket.on('room:connect', connectionId => {
			const globalConnectionId = socket.globalConnectionId;
			
			console.log('[room:connection]', connectionId.slice(0, 5));
			users[connectionId]?.socket.emit('room:connect', globalConnectionId);
		})
		


		
		socket.on('disconnect', () => {
			const globalConnectionId = socket.globalConnectionId;
			delete users[globalConnectionId];
			
		})
		

	})
	
	io.of('/rooms').adapter.on('leave-room', (room, socketId) => {
		io.to(room).emit('room:user-leave', socketId)

	});




}
