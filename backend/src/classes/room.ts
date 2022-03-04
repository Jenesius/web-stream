import ApiError from "./api-error";
import {Socket} from "socket.io";

export type RoomId = string;



export default class Room{

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
