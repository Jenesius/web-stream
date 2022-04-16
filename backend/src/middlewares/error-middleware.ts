import {Request, Response} from "express";
import ApiResponse from "../utils/api-response";
import log4js from "log4js";

export default (err, req: Request, res: Response, next) => {
	
	const logger = log4js.getLogger('error');
	logger.error(err);
	
	res.json(ApiResponse.error(err))
	
}
