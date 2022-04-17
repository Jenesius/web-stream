import {Request, Response} from "express";
import AuthError from "../errors/auth-error";
import TokenService from "../services/token-service";
import ApiResponse from "../utils/api-response";

export default async (req: Request, res: Response, next) => {
	
	try {
		const cookies = req.cookies;
		
		let tokens = {accessToken: cookies.accessToken, refreshToken: cookies.refreshToken};
		
		if (TokenService.isExpired(tokens.accessToken)) {
			console.log('auth is expired');
			tokens = await TokenService.refresh(tokens.refreshToken);
			ApiResponse.setTokens(res, tokens);
		}
		
		if (!TokenService.validateAccessToken(tokens.accessToken)) {
			console.log('is not validated');
			res.clearCookie('accessToken')
			res.clearCookie('refreshToken');
			
			throw AuthError.Unauthorized();
		}
		console.log(TokenService.getData(tokens.accessToken))
		req.userId = TokenService.getData(tokens.accessToken).userId;
		console.log(req.userId);
		next();
		
	} catch (e) {
		next(e);
	}
	
}
