import {Server, Socket} from "socket.io";

export default (io: Server, socket: Socket) => {
	

	
	socket.on('signal:message', data => {
		console.log(data);
	})
	
	
}
