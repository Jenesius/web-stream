import {Server, Socket} from "socket.io";

const store: { [name: string]: Socket } = {};
setInterval(() => {
	console.log('signals:', Object.keys(store).map(s => s.slice(0, 5)));
}, 15000);
export default (io: Server, socket: Socket) => {
	
	const globalConnectionId = socket.globalConnectionId;
	store[globalConnectionId] = socket;
	
	socket.on('message', (data: {recipient: string}) => {
		const globalConnectionId = socket.globalConnectionId;
		// Запомнили, кому отправляет сообщение
		const clientId = data.recipient;
		
		if (!store[clientId]) return  console.warn('Undefined client', data);
		// @ts-ignore
		store[clientId].emit('message', {
			...data,
			sender: globalConnectionId // указываем, от кого пришло сообщение
		})
		
	})
	
	socket.on('disconnect', () => {
		const globalConnectionId = socket.globalConnectionId;
		delete store[globalConnectionId];
	})
}
