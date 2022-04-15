export default function Request(url: string, params: RequestInit) {
	
	return fetch(url, params).then(res => res.json());
	
}
