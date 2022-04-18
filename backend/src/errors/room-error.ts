export default class RoomError extends Error {
	
	static UserAlreadyConnected() {
		return new RoomError('Пользователь уже подключён к комнате.')
	}
	
}
