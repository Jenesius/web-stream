import jwt from "jsonwebtoken";
export default class TokenService {
	
	static generate(payload: any) {
	
		const accessToken = jwt.sign(payload, process.env["JWT_ACCESS_SECRET"] as string, {expiresIn: '1h'})
		const refreshToken =jwt.sign(payload, process.env["JW_REFRESH_SECRET"] as string, {expiresIn: '30d'})
	
		return {accessToken, refreshToken};
	}
	
}
