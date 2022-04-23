import Group from "../models/group-model";
import GroupInvite from "../models/group-invite-model";
import GroupMember from "../models/group-member-model";

export default class GroupService {
	
	static async create(userId: string, data: GroupCreateData) {
		
		const group = new Group({
			name: data.name,
			creator: userId
		})
		
		await group.save();
		
		await GroupService.invite({
			groupId: group.id,
			invites: data.invites,
			userId
		})
		
		return group.id;
		
	}
	static async invite(params: InviteParams) {
		
		const groupId = params.groupId
		// !!!1. Проверка на существование группы и принадлежность пользователя
		
		const invites = await GroupInvite.create(params.invites.map(userId => ({
			groupId,
			userId
		})))
		
		return invites;
	}
	
	static async getMembers(groupId: string) {
	
		const array = await GroupMember.find({
			groupId
		}, {
			_id: 0,
			groupId: 1,
			user: 1
		}).populate('user', {
			id: 1,
			username: 1
		})
	
		return array.map(elem => elem.user);
	}
}

interface GroupCreateData {
	name: string,
	invites: string[]
}
interface InviteParams {
	groupId: string,
	userId: string,
	invites: string[]
}
