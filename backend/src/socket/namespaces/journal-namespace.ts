import {Server} from "socket.io";
import log4js from 'log4js';
export default function (io: Server) {
	io.of('/journal').on('connection', socket => {
		
		socket.on('new', data => {
			

			var logger = log4js.getLogger();
			logger.debug(data);
			
		})
		
	})
}
