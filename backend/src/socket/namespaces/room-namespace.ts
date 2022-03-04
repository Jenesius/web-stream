import {Server, Socket} from "socket.io";
import Room from "../../classes/room";
function handleRouteSocket (socket: Socket, event: string, callback) {

	socket.on(event, payload => {

		try {
			callback(payload, socket);
		} catch (e) {
			console.log(e);
			socket.emit('error', e);
		}

	})

}
export default (io: Server) => {

	const DefaultRoom = new Room('Default', io.of('/rooms'));

	io.of('/rooms').on('connection', socket => {

		handleRouteSocket(socket, 'room:join', () => {
			DefaultRoom.connect(socket);
		})

		handleRouteSocket(socket, 'room:leave', () => {
			DefaultRoom.disconnect(socket);
		})

		// Default handlers
		handleRouteSocket(socket, 'disconnect', () => {
			try {
				DefaultRoom.disconnect(socket);

			} catch (e) {
				//console.log(e);
			}
		})


	})

	setInterval(() => {




		console.log(
			[...io.of('rooms').sockets.keys()]
		)

	}, 5000);




}
