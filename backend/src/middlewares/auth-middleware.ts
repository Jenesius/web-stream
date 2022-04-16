import {Request, Response} from "express";
import AuthError from "../errors/auth-error";
import TokenService from "../services/token-service";

export default (req: Request, res: Response, next) => {
	
	try {
		const cookies = req.cookies;
		
		const {accessToken} = cookies;
		
		// Добавить прокерку на isExpired !!!
		
		if (!accessToken) throw AuthError.Unauthorized();
		
		if (!TokenService.validateAccessToken(accessToken)) {
			res.clearCookie('accessToken')
			res.clearCookie('refreshToken');
			
			throw AuthError.Unauthorized();
		}
		
		next();
		
	} catch (e) {
		next(e);
	}
	
}
