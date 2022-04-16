import {reactive} from "vue";

interface ProcessWrapInterface{
	wait: boolean,
	error: boolean,
	call: (...a: any) => void,
	setFunction: (newFunc: (...a: any) => any) => void
}

type promiseFunction = (...a: any) => Promise<any>

export default function useProgress(fn: promiseFunction): ProcessWrapInterface {
	
	let func = fn;
	
	const wrap: any = reactive({
		wait: false,
		error: false
	})
	
	wrap.call = async function (...args: any) {
		
		this.wait = true;
		this.error = false;
		
		try {
			await func(...args);
		} catch (e) {
			this.error = true;
		}
		
		
		this.wait = false;
	}
	
	wrap.setFunction = async function (newFunc: (...a:any) => any) {
		func = newFunc;
	}
	
	
	return wrap;
	
}
