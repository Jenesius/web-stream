import express from "express";
import http from "http";
import { Server} from "socket.io";


const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
});
const config = {
    port: 3333
}
/*
app.get('/page', (_req, res) => {
    res.sendFile(path.join(__dirname, '../f/index.html'));
})*/

//app.use('/rooms', roomRouter);

server.listen(config.port,  () => {
    console.log('Server run on', config.port);
})



app.on('error', (err) => {
    console.warn(err);
})
