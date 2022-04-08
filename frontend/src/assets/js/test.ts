import EventEmitter from "./event-emitter/event-emitter";

class Test extends EventEmitter{
	
	
	test() {
		this.emit('test');
	}
	
}

export default function rin() {
	const test =new Test();
	const off = test.on('test', () => {
		console.log('AAA');
	});
	
	setInterval(() => {
		test.test();
		
	}, 100);
	
	setTimeout(() => {
		
		off();
		console.log(test);
	}, 1000)
}


