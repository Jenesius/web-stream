import {model, Schema} from "mongoose";

interface IToken{
	userId: string,
	refreshToken: string
}

const TokenSchema = new Schema<IToken>({
	userId: {type: String, required: true},
	refreshToken: {type: String, required: true}
})

const Token = model('token', TokenSchema);
export default Token;
