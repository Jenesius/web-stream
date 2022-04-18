import http from "http";
import {Server} from "socket.io";

import RoomNamespace from "./namespaces/room-namespace";
import JournalNamespace from "./namespaces/journal-namespace";


export default function connectSocket(server: http.Server) {

    const io = new Server(server);

    RoomNamespace(io);
    JournalNamespace(io);
    
   
    return io;
}
