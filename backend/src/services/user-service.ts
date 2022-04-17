import User from "../models/user-model";
import bcrypt from "bcrypt";
import TokenService from "./token-service";
import UserError from "../errors/user-error";

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
		
		const tokens = TokenService.generate({userId: user.id});
		
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
	
	static async getById(id: string) {}
	
	static async getList(data: UserListFilters = {}) {
		
		const i = new RegExp(`^${data.startsWith || ''}`);
		
		const result = await User.find({
			username: {
				$regex: i
			}
		}, {
			email: 1,
			username: 1,
			id: 1
		}).exec()
		
		return result;
	}
	
}

interface CreateUserParam {
	email: string,
	activated?: boolean,
	password?: string
}
interface UserListFilters {
	startsWith?: string
}
