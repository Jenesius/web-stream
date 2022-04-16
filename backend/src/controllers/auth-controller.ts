import {Request, Response} from "express";
import ApiResponse from "../utils/api-response";
import UserService from "../services/user-service";

class AuthController {
	
	static login(req: Request, res: Response, next) {
		try {
			
			
			
			
			res.send(ApiResponse.success(true))
			
		} catch (e) {
			next(e);
		}
	}
	
	static async registration(req: Request, res: Response, next) {
		
		try {
			const {email} = req.body
			
			await UserService.create({email});
			
			res.send(ApiResponse.success(true))
			
		} catch (e) {
			console.log('[registration] error');
			next(e);
		}

	}
	
}

export default AuthController;
