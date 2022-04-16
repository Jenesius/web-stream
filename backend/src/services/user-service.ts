import User from "../models/user-model";
import bcrypt from "bcrypt";
import TokenService from "./token-service";

export default class UserService {
	
	static async create({email, activated, password}: CreateUserParam): Promise<string> {
		
		const username = email;
		
		const user = new User({
			username,
			email,
			activated
		});
		
		if (password) {
			user.password = await bcrypt.hash(password, 10);
		}
		
		await user.save();
		
		
		return user.id;
		
	}
	
	static async generateTokens(userId: string) {
	
		const user = await User.findById(userId);
		
		if (!user) throw UserError.UserNotFound();
		
		const tokens = TokenService.generate({id: user.id});
		
		user.refreshToken = tokens.refreshToken;
		await user.save();
		
		return tokens;
	}
	
	static async login(email: string, password: string) {
		
		const user = await User.findOne({email});
		
		if (!user) throw UserError.UserNotFound();
		
		if ( !(await bcrypt.compare(password, user.password))) {
			throw UserError.IncorrectUserAuthData();
		}

		return await UserService.generateTokens(user.id);
	}
	
}

interface CreateUserParam {
	email: string,
	activated?: boolean,
	password?: string
}
