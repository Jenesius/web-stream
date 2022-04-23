import {Server} from "socket.io";
import log4js from 'log4js';
export default function (io: Server) {
	io.of('/journal').on('connection', socket => {
		socket.on('new', data => {

			const logger = log4js.getLogger('client-journal');
			logger.info(data);
			
		})
		socket.on('add', data => {
			const logger = log4js.getLogger('client-journal');
			logger.info(data);
			
		})
	})
}
