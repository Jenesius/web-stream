import http from "http";
import {Server} from "socket.io";

import RoomNamespace from "./namespaces/room-namespace";
import PeerNamespace from "./namespaces/peer-namespace";
import JournalNamespace from "./namespaces/journal-namespace";
import GroupNamespace from "./namespaces/group-namespace";

import defaultNamespace from "./namespaces/default-namespace";
import signalsNamespace from "./namespaces/signals-namespace";

import identifySocketMiddleware from "./../middlewares/identify-socket-middleware";

export default function connectSocket(server: http.Server) {

    const io = new Server(server, {
        cookie: true
    });


    
    io.on('connection', s => defaultNamespace(io, s));
    //io.use(identifySocketMiddleware)
    io.of('/signals').use(identifySocketMiddleware).on('connection', s => signalsNamespace(io, s));
    
    
    RoomNamespace(io);
    JournalNamespace(io);
    PeerNamespace(io);
    GroupNamespace(io);
    
    
    //io.of('/signals').on('connection', s => SignalingNamespace(io, s))
    
    return io;
}
