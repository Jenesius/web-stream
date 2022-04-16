import {model, Schema} from "mongoose";

interface IGroup{
	name: string
}

const groupSchema = new Schema<IGroup>({
	name: {type: String, required: true}
})

const Group = model('group', groupSchema);
export default Group
