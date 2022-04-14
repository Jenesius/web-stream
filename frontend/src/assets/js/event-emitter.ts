export default class EventEmitter{
	
	private events: {
		[name: string]: Callback[]
	} = {}
	
	constructor() {
		this.events = {};
	}
	
	on(name: string, callback: Callback) {
		if (!(name in this.events)) this.events[name] = [];
		
		this.events[name].push(callback);
		
		return this.off.bind(this, name, callback);
		
	}
	emit(name: string, data?: any) {
		
		if (! (name in this.events)) return;
		
		this.events[name].forEach(cl => cl(data));
		
	}
	
	off(name: string, callback: Callback) {
		const arr = this.events[name];
		if (!arr) return;
		
		const index = arr.indexOf(callback);
		
		if (index === -1) return;
		arr.splice(index, 1);

	}
	
	protected cleanEvents(){
		this.events = {};
	}
}

export type Callback = (data?: any) => any | void
