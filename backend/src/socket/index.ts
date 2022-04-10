import http from "http";
import {Server, Socket} from "socket.io";
import Room from "../classes/room";
import RoomNamespace from "./namespaces/room-namespace";
import JournalNamespace from "./namespaces/journal-namespace";

// @ts-ignore
function handleRouteSocket (socket: Socket, event: string, callback) {

    socket.on(event, payload => {

        try {
            callback(payload, socket);
        } catch (e) {
            console.log(e);
            socket.emit('error', e);
        }

    })

}

const DefaultRoom = new Room('Default', null);
// @ts-ignore
class SocketController {
    static roomConnect(payload, socket) {
        DefaultRoom.connect(socket);
    }

    static roomLeave(payload, socket) {
        DefaultRoom.disconnect(socket);
    }

}


export default function connectSocket(server: http.Server) {

    const io = new Server(server);

    RoomNamespace(io);
    JournalNamespace(io);
    
    /*io.on('connection', (socket) => {
        console.log('a user connected');

        handleRouteSocket(socket, 'room-connect', SocketController.roomConnect)


        socket.on('room-disconnect', data => {
            socket.leave('');
        })

        handleRouteSocket(socket , 'disconnect', SocketController.roomLeave)

    });
*/
    return io;
}
