import {model, Schema} from "mongoose";

interface IGroupInvite {
	groupId: string,
	userId: string
}

const groupInviteSchema = new Schema<IGroupInvite>({
	groupId: {type: String, required: true},
	userId : {type: String, required: true}
})

const GroupInvite = model('group-invite', groupInviteSchema);
export default GroupInvite
