import {Request, Response} from "express";
import GroupService from "../services/group-service";
import ApiResponse from "../utils/api-response";

export default class GroupController{
	
	static async create(req: Request, res: Response, next) {
		try {
		
			const userId = req.userId;
			
			const {name, invites} = req.body;
			
			const groupId = await GroupService.create(userId, {name, invites});
			
			res.json(ApiResponse.success({groupId}))
		
		} catch (e) {
			next(e);
		}
	}
	static async read () {}
	static async update () {}
	static async delete () {}
	
	static async getList () {}
	
}
