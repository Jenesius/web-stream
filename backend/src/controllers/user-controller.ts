import {Request, Response} from "express";
import ApiResponse from "../utils/api-response";

export default class UserController {
	
	create (req: Request, res: Response, next) {
		try {
			
			const {email, password} = req.body;
			
			console.log(email, password);
			
			res.send(ApiResponse.success({email}))
			
		} catch (e) {
			next(e);
		}
	}
	
}
