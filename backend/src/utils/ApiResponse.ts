export default class ApiResponse{
	static success(data: any) {
		return {
			success: true,
			data
		}
	}
	static error(error: Error) {
		return {
			success: false,
			msg: error.message,
		}
	}
}
