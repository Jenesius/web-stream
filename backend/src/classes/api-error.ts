import {RoomId} from "./room";

export default class ApiError extends Error {

    code: number;

    constructor(code = 400, message = '') {
        super();
        this.code = code;
        this.message = message;
    }

    static UserNotFoundInRoom(roomId: RoomId, userId) {
        return new ApiError(400,`Пользователь ${userId} не подключён к комнате ${roomId}`)
    }
    static UserAlreadyConnected(roomId: RoomId, userId) {
        return new ApiError(400, `User with id ${userId} already connected to room with id ${roomId}`)
    }

}
