import Request from "@/assets/js/request";

export default class GroupService {
	
	static async create(data:any) {
		
		return Request('/close-api/groups', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		
	}
	
}
