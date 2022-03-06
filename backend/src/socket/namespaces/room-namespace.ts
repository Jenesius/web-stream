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
			[...io.of('peers').sockets.keys()],
			Object.values(peers).map(elem => elem.id)
		)

	}, 5000);


	const peers:{[name: string]: Socket} = {};

	io.of('/peers').on('connection', socket => {


		socket.on('peer:join', (() => {

			socket.join('test');

			/**
			 * Всех, кто ранее был подключён - просим создать offer для звонка
			 * */
			Object.keys(peers).forEach(id => {
				socket.broadcast.to('test').emit('peer:new-offer', {
					clientId: socket.id
				})
			})

			peers[socket.id] = socket;
		}))


		/**
		 * Передача цели offer'a
		 * Клиент должен его установить в setRemoteDescription
		 * */
		socket.on('peer:offer', data => {
			const {offer, clientId} = data;

			peers[clientId]?.emit('peer:offer', {offer, clientId: socket.id});
		})

		socket.on('peer:answer', data => {

			const {answer, clientId} = data;

			peers[clientId]?.emit('peer:answer', {answer, clientId: socket.id})

		})

		socket.on('disconnect', () => {
			delete peers[socket.id];

			socket.broadcast.to('room').emit('peer:cancel-connection', {
				clientId: socket.id
			})

		})

	})


}
