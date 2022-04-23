import {Socket} from "socket.io";

import cookie from "cookie";

export default (socket: Socket, next) => {
	
	const c = cookie.parse(socket.request.headers.cookie || '');
	console.log('cookie', c);
	if (!c || !c["globalConnectionId"]) return next();
	
	socket.globalConnectionId = c["globalConnectionId"];
	next();
}
