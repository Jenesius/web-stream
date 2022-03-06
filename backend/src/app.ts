import express from "express";
import http from "http";
import path from "path";
//import roomRouter from './routes/room-route';
import connectSocket from "./socket";
import detenv from "dotenv";
detenv.config({
    path: path.join(__dirname, '..', '.env')
});

const app = express();
const server = http.createServer(app);

process.env["PROJECT_DIR"] = path.join(__dirname, '..');

// @ts-ignore
const io = connectSocket(server);

const config = {
    port: 3333
}

app.get('/page', (_req, res) => {
    res.sendFile(path.join(__dirname, '../f/index.html'));
})

//app.use('/rooms', roomRouter);

server.listen(config.port,  () => {
    console.log('Server run on', config.port);
})




app.on('error', (err) => {
    console.warn(err);
})
