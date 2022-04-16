import Group from "../models/group-model";

export default class GroupService {
	
	static async create(userId: string, data: GroupCreateData) {
		
		const group = new Group({
			...data,
			userId
		})
		
		await group.save();
		
		return group.id;
		
	}
	
}

interface GroupCreateData {
	name: string
}
