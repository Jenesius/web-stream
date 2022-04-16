import {Error as MongooseError} from "mongoose";

export default class ApiResponse{
	static success(data: any) {
		return {
			success: true,
			data
		}
	}
	static error(err: any) {
		
		let msg = [err.message];
		
		if (err instanceof MongooseError.ValidationError) {
			
			msg = [];
			for (const field in err.errors) {
				
				
				const error = err.errors[field];
				
				if (!error) return;
				
				switch (error.kind) {
					case 'required':  msg.push(`Поле ${error.path} обязательно.`); break;
				}
				
			}
		}
		
		return {
			success: false,
			msg,
		}
	}
}
