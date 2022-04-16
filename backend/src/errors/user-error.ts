class UserError extends Error{
	static UserNotFound() {
		return new Error(`Пользователь не найден.`);
	}
	
	static IncorrectUserAuthData() {
		return new Error('Email или Пароль не верны.');
	}
}
