import {Server} from "socket.io";

export default (io: Server) => {
	
	io.of('/group').on('connection', socket => {
	
		/**
		 * Чтение текущих комнат.
		 * */
		socket.on('group:read-rooms', ({groupId}) => {
			try {
				socket.emit('group:rooms-list', [
					{
						id: '1',
					},
					{
						id: '2'
					},
					{
						id: '3'
					}
				])
			} catch (e) {
				console.warn(e);
			}
		})

		
	})
	
}
