import {Request, Response} from "express";
import AuthError from "../errors/auth-error";
import TokenService from "../services/token-service";
import ApiResponse from "../utils/api-response";

export default async (req: Request, res: Response | null, next) => {
	
	try {
		const cookies = req.cookies;
		if (!cookies) throw AuthError.Unauthorized();
		
		let tokens = {accessToken: cookies.accessToken, refreshToken: cookies.refreshToken};
		
		if (TokenService.isExpired(tokens.accessToken)) {
			tokens = await TokenService.refresh(tokens.refreshToken);
			if (res) ApiResponse.setTokens(res, tokens);
		}
		
		if (!TokenService.validateAccessToken(tokens.accessToken)) {
			if (res) {
				res.clearCookie('accessToken')
				res.clearCookie('refreshToken');
			}
			
			throw AuthError.Unauthorized();
		}
		req.userId = TokenService.getData(tokens.accessToken).userId;
		next();
		
	} catch (e) {
		next(e);
	}
	
}
