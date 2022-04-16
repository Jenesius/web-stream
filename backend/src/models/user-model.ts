import {Schema, model} from "mongoose";

interface IUser {
	email: string,
	username: string,
}

const userSchema = new Schema<IUser>({
	email: { type: String, required: true, unique: true},
	username: {type: String, required: true},
})

const User =  model<IUser>('user', userSchema);
export default User;

