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
			const {offer, clientId} = data;

			peers[clientId]?.emit('peer:offer', {offer, clientId: socket.id});
		})

		socket.on('peer:candidate', data => {
			const {candidate, clientId} = data;

			peers[clientId]?.emit('peer:candidate', {candidate, clientId: socket.id})

		})

		socket.on('peer:answer', data => {

			const {answer, clientId} = data;

			peers[clientId]?.emit('peer:answer', {answer, clientId: socket.id})

		})

		socket.on('disconnect', () => {

			delete peers[socket.id];

			socket.broadcast.to(ROOM_NAME).emit('peer:user-leave', {
				clientId: socket.id
			})

		})

	})


}
