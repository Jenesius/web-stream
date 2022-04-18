import http from "http";
import {Server} from "socket.io";

import RoomNamespace from "./namespaces/room-namespace";
import PeerNamespace from "./namespaces/peer-namespace";
import JournalNamespace from "./namespaces/journal-namespace";
import GroupNamespace from "./namespaces/group-namespace";
import SignalingNamespace from "./namespaces/signaling-channel-namespace";


export default function connectSocket(server: http.Server) {

    const io = new Server(server);

    RoomNamespace(io);
    JournalNamespace(io);
    PeerNamespace(io);
    GroupNamespace(io);
    
    
    io.of('/signals').on('connection', s => SignalingNamespace(io, s))
    
    return io;
}
