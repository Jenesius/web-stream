import {Manager} from "socket.io-client";


/**
 * Определение URL по которому будет происходить подключение к сокетам, порт дол
 * жен совпадать с портом указанным в devServer как proxy (Для development mode)
 * */
const url = process.env.NODE_ENV === 'production'?
	`wss://${document.location.host}`:
	'ws://localhost:3333'

const manager = new Manager(url, {
	transports: ['websocket']
});


export default function useSocket(params: ISocketParams = {}) {
	
	const namespace = (params.namespace) ? '/' + params.namespace: '' ;
	
	return manager.socket(namespace);
}

interface ISocketParams{
	namespace?: 'journal' | 'rooms' | 'signals'
}
