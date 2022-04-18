import {Socket, Server} from "socket.io";



export default (io: Server, socket: Socket) => {

	const onMessage = (data: IMessageData) => {
		socket.broadcast.emit('message', data)
	}
	
	socket.on('message', onMessage)
	
}

interface IMessageData {
	description?: RTCSessionDescription,
	recipient: string
}
