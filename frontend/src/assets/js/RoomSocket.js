import Socket from "./socket";

export default class RoomSocket extends Socket{
	
	constructor() {
		super('rooms');
	}
	
}
