import {Request, Response} from "express";
import randomstring from "randomstring"

export default (req: Request, res: Response, next) => {
	console.log('setting cookie before get page', res.cookie);
	res.cookie('globalConnectionId', randomstring.generate(128), { httpOnly: false, });

	next();
	
}
