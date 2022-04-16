export default class AuthError extends Error{
	static Unauthorized() {
		return new Error('Для получения запрашиваемого ответа нужна аутентификация');
	}
}
