import jwt from "jsonwebtoken";
import AuthError from "../errors/auth-error";
import Token from "../models/token-model";

export default class TokenService {
	
	static generate(payload: any) {
	
		console.log('generate paload', payload);
		
		const accessToken = jwt.sign(payload, process.env["JWT_ACCESS_SECRET"] as string, {expiresIn: '1m'})
		const refreshToken =jwt.sign(payload, process.env["JWT_REFRESH_SECRET"] as string, {expiresIn: '30d'})
	
		return {accessToken, refreshToken};
	}
	
	static async save(userId, refreshToken) {
		
		await Token.findOneAndUpdate({ userId }, {userId, refreshToken}, {new: true, upsert: true});
		
	}
	
	static async refresh(refreshToken: string) {
		
		if (!TokenService.validateRefreshToken(refreshToken)) throw AuthError.WrongVerifyRefreshToken();
		
		// Найти клиента с таким токеном из БД.
		
		const payload = jwt.decode(refreshToken);
		
		if (!payload || typeof payload === 'string') throw AuthError.WrongPayload();
		
		const tokens = TokenService.generate({userId: payload["userId"]});
		
		await TokenService.save(payload["userId"], tokens.refreshToken);
		
		return tokens;
	}
	
	static validateAccessToken(token: string) {
		try {
			jwt.verify(token, process.env["JWT_ACCESS_SECRET"] as string);
			return true;
		} catch (e) {
			return null;
		}
	}
	static validateRefreshToken(token: string) {
		try {
			jwt.verify(token, process.env["JWT_REFRESH_SECRET"] as string);
			return true;
		} catch (e) {
			return null;
		}
	}
	static isExpired(token) {

		if (!TokenService.validateAccessToken(token)) return true;
		
		const decode = jwt.decode(token);
		
		if (!decode || typeof decode === 'string') throw AuthError.WrongPayload();
		
		const {exp} = decode;
		
		if (!exp) return true;
		
		return Date.now() >= exp * 1000;
		
		
		
	}
	
	static getData(token): {userId: string} {
		return  jwt.decode(token, {complete: true})?.payload as {userId: string};
	}
	
}
