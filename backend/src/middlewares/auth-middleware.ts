import {Request, Response} from "express";
import AuthError from "../errors/auth-error";
import TokenService from "../services/token-service";
import ApiResponse from "../utils/api-response";

export default async (req: Request, res: Response, next) => {
	
	try {
		const cookies = req.cookies;
		
		let tokens = {accessToken: cookies.accessToken, refreshToken: cookies.refreshToken};
		
		if (TokenService.isExpired(tokens.accessToken)) {
			tokens = await TokenService.refresh(tokens.refreshToken);
			ApiResponse.setTokens(res, tokens);
		}
		
		if (!TokenService.validateAccessToken(tokens.accessToken)) {
			res.clearCookie('accessToken')
			res.clearCookie('refreshToken');
			
			throw AuthError.Unauthorized();
		}
		req.userId = TokenService.getData(tokens.accessToken).userId;
		next();
		
	} catch (e) {
		next(e);
	}
	
}
