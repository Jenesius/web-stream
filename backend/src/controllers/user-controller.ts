import {Request, Response} from "express";
import ApiResponse from "../utils/api-response";
import UserService from "../services/user-service";

export default class UserController {
	
	static async get(req: Request, res: Response, next) {
		try {
		
			
			res.json(ApiResponse.success({a: '123'}))
		} catch (e) {
			next(e)
		}
	}
	static async getList(req: Request, res: Response, next) {
		try {
		
			let {startsWith} = req.query;
			
			if (typeof startsWith !== 'string') startsWith = '';
			
			const r = await UserService.getList({startsWith})

			res.json(ApiResponse.success(r));
			
		} catch (e) {
			next(e)
		}
	}
	
}
