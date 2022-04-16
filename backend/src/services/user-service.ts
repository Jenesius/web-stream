import User from "../models/user-model";

export default class UserService {
	
	static async create({email}: CreateUserParam) {
		
		const username = email;
		
		const user = new User({
			username,
			email
		});
		
		await user.save();
		
	}
	
}

interface CreateUserParam {
	email: string
}
