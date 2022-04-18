import ApiError from "./api-error";
import {Socket} from "socket.io";
import RoomError from "../errors/room-error";
import EventEmitter from "jenesius-event-emitter";

export type RoomId = string;


export default class Room extends EventEmitter{
    static EVENT_NEW_USER = 'room:new-user'
    static EVENT_UPDATE_USERS = 'room:update-users'
    
    users: {
        [name: string]: {
            name: string
        }
    } = {}
    
    /**
     * @description Connection user to room.
     * */
    join(params: IJoinParams) {
        
        const userId = params.id;
        
        if (this.include(userId)) throw RoomError.UserAlreadyConnected();
     
        // Сохранение пользователя в хранилище
        this.users[userId] = {
            name: params.name
        }
        
        // Сообщаем о том, что новый пользователь был добавлен
        this.emit(Room.EVENT_NEW_USER, userId);
    }
    include(id: string) {
        return (id in this.users);
    }
    
    leave(userId: string) {
        if (!this.include(userId)) return;
        
        delete this.users[userId];
        this.emit(Room.EVENT_UPDATE_USERS);
    }
    
}
interface IJoinParams {
    id: string,
    name: string
}



export class Room1{

    users: string[]
    id: RoomId
    io: any


    constructor(id, io) {
        this.id = id;
        this.io = io;

        this.users = [];
    }

    connect(socket: Socket){

        const userId = socket.id;

        if (this.users.includes(userId))
            throw ApiError.UserAlreadyConnected(this.id, userId);

        socket.join(this.id);
        this.users.push(userId);

        this.io.in(this.id).emit('room:information', {
            roomId: this.id,
            users : this.users
        })




    }
    disconnect(socket: Socket) {

        const userId = socket.id

        const index = this.users.indexOf(userId);

        if (index === -1) throw ApiError.UserNotFoundInRoom(this.id, userId)

        socket.leave(this.id);
        this.users.splice(index,1);

        this.io.in(this.id).emit('room:information', {
            roomId: this.id,
            users : this.users
        })

    }

}
