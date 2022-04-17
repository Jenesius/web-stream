import Request from "@/assets/js/request";
export default class UserService {
	
	static url = '/close-api/users'
	
	static getList(): Promise<IUser> {
		return Request(UserService.url + '/', {
			method: 'get',
			headers: {
				'Content-Type': 'application/json'
			}
		})
	}
	
}

interface IUser {
	id: string,
	email: string,
	username: string
}
