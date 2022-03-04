import Socket from "./Socket";

export default class RoomSocket extends Socket{
	
	constructor() {
		console.log('++');
		super('rooms');
	}
	
}
