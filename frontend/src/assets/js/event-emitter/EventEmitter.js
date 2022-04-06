export default class EventEmitter{
	
	constructor() {
		this.events = {};
	}
	
	on(name, callback) {
		if (!(name in this.events)) this.events[name] = [];
		
		this.events[name].push(callback);
		
	}
	emit(name, data) {
		
		if (! (name in this.events)) return;
		
		this.events[name].forEach(cl => cl(data));
		
	}
	
}
