import {Schema, model} from "mongoose";
interface IUser {
	email: string,
	username: string,
	activated: false,
	password: string,
	refreshToken: string
}

const userSchema = new Schema<IUser>({
	email: { type: String, required: true, unique: true},
	username: {type: String, required: true},
	activated: {type: Boolean, default: false},
	password: {type: String},
	refreshToken: {type: String}
})

const User =  model<IUser>('user', userSchema);
export default User;

