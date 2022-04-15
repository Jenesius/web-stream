import {Request, Response} from "express";
import ApiResponse from "../utils/ApiResponse";

class AuthController {
	
	static login(req: Request, res: Response, next) {
		try {
			
			res.send(ApiResponse.success(true))
			
		} catch (e) {
			next(e);
		}
	}
	
	static registration() {
		console.log('registration')
	}
	
}

export default AuthController;
