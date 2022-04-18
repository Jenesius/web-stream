import {Server, Socket} from "socket.io";
import randomstring  from "randomstring";

let count = 0;
export default (io: Server, socket: Socket) => {
	
	const id = randomstring.generate(32) + count++;
	console.log('id:', id);
	socket.emit('identify', {
		globalId: id
	});
	
	socket.on('signal:message', data => {
		console.log(data);
	})
	
	
}
