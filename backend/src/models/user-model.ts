import {Schema, model, Document} from "mongoose";
interface IUser extends Document{
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
userSchema.virtual('id').get(function(this: IUser){
	return this._id;
});

userSchema.set('toObject', {
	virtuals: true,
	transform: function (doc, ret) {   delete ret._id  }
})
userSchema.set('toJSON', {
	virtuals: true,
	transform: function (doc, ret) {   delete ret._id  }
})
const User =  model<IUser>('user', userSchema);
export default User;

