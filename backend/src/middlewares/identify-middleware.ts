import {Request, Response} from "express";
import randomstring from "randomstring"

export default (req: Request, res: Response, next) => {
	
	res.cookie('globalConnectionId', randomstring(128), { httpOnly: true, });
	
	next();
	
}
