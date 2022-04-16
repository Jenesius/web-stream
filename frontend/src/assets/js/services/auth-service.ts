import Request from "@/assets/js/request";

export default class AuthService{
	
	static startUrl = '/open-api/auth/';
	
	static login(data: LoginData) {
		return Request(AuthService.startUrl + 'login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
	}
	static registration(data: RegistrationData) {
		
		return Request(AuthService.startUrl + 'registration', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		
	}
}

interface LoginData {
	email: string,
	password: string
}

interface RegistrationData {
	email: string,
	password: string
}
