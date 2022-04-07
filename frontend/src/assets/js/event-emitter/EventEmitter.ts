export default class EventEmitter{
	
	events: {
		[name: string]: Callback[]
	} = {}
	
	constructor() {
		this.events = {};
	}
	
	on(name: string, callback: Callback) {
		if (!(name in this.events)) this.events[name] = [];
		
		this.events[name].push(callback);
		
	}
	emit(name: string, data: any) {
		
		if (! (name in this.events)) return;
		
		this.events[name].forEach(cl => cl(data));
		
	}
	
}

type Callback = (data?: any) => any | void
