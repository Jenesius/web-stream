import {Request, Response} from "express";
import ApiResponse from "../utils/api-response";
import UserService from "../services/user-service";

class AuthController {
	
	static async login(req: Request, res: Response, next) {
		try {
			const {email, password} = req.body;
			
			const tokens = await UserService.login(email, password);
			
			ApiResponse.setTokens(res, tokens);
			
			res.send(ApiResponse.success({}))
		} catch (e) {
			next(e);
		}
	}
	
	static async registration(req: Request, res: Response, next) {
		
		try {
			const {email, password} = req.body
			
			const id = await UserService.create({email, password});
			
			const tokens = await UserService.generateTokens(id);
			
			ApiResponse.setTokens(res, tokens);
			
			res.send(ApiResponse.success({}))
			
		} catch (e) {
			console.log('[registration] error');
			next(e);
		}

	}
	
}

export default AuthController;
