export default class AuthError extends Error{
	static Unauthorized() {
		return new Error('Для получения запрашиваемого ответа нужна аутентификация');
	}
	static WrongPayload() {
		return new Error('Изменённый payload.')
	}
	static WrongVerifyAccessToken() {
		return new Error('Access token is unverified.')
	}
	static WrongVerifyRefreshToken() {
		return new Error('Refresh token is unverified.')
	}
}
