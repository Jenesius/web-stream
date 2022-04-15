import Request from "@/assets/js/request";

export default class AuthService{
	
	static login() {
		return Request('/api/open/auth/login', {
			method: 'POST'
		});
	}
	
}
