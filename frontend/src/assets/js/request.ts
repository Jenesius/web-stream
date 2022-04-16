
interface RequestResponse {
	success: boolean,
	msg: string | string[],
	data: any
}

export default function Request(url: string, params: RequestInit) {
	
	return fetch(url, params).then(res => res.json())
	.then((data: RequestResponse) => {
		if (!data.success) throw data.msg;
		
		return data.data;
		
	})
	
}
