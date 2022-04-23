import {Socket} from "socket.io";

import cookie from "cookie";

export default (socket: Socket, next) => {
	
	const c = cookie.parse(socket.request.headers.cookie || '')
	console.log(socket.request.headers);
	if (!c || !c["globalConnectionId"]) return next();
	
	console.log('set gci', c["globalConnectionId"]);
	
	socket.globalConnectionId = c["globalConnectionId"];
	next();
}
