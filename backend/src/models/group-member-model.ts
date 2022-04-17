import {model, Schema} from "mongoose";

interface IGroupMember {
	groupId: string,
	user : string
}

const GroupMemberSchema = new Schema<IGroupMember>({
	groupId: { type: String, required: true},
	user : { type: Schema.Types.ObjectId, ref: 'user'}
})


const GroupMember = model('group-member', GroupMemberSchema);
export default GroupMember;
