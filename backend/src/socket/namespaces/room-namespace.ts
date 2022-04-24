import {Server, Socket} from "socket.io";

const users:{
	[name: string]: {
		socket: Socket,
		userId?: string
	}
} = {};
export default (io: Server, socket: Socket) => {
	
	console.log(`[rooms] id:`, socket.globalConnectionId);
	
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
			
			users[globalConnectionId] = {socket};
			
		} catch (e) {
			console.log(`[room:join]`, e)
		}
		
	})
	
	socket.on('room:connect', connectionId => {
		const globalConnectionId = socket.globalConnectionId;
		users[connectionId]?.socket.emit('room:connect', globalConnectionId);
	})
	
	socket.on('disconnect', () => {
		const globalConnectionId = socket.globalConnectionId;
		delete users[globalConnectionId];
	})

}
