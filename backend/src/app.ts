import express from "express";
import http from "http";
import path from "path";
//import roomRouter from './routes/room-route';
import connectSocket from "./socket";
import detenv from "dotenv";
import log4js from "log4js";
import {useRouter} from "./routes";
import bodyParser 	from "body-parser";

// getting-started.js
import mongoose from "mongoose";

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/web-stream');
}

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

const frontDir = path.join(__dirname, '..', '..', 'frontend', 'build');

app.use(express.static(frontDir));

app.use(bodyParser.json())

useRouter(app);

//app.use('/rooms', roomRouter);

server.listen(config.port,  () => {
    console.log('Server run on', config.port);
})


app.get('*', function (req, res) {
    res.sendFile(path.join(frontDir, 'main.html'));
});

app.on('error', (err) => {
    console.warn('on error app',err);
})

const logDir = path.join(__dirname, '..', 'Logs');



log4js.configure({
    appenders: {
        main: { type: "file", filename: path.join(logDir, "default.log") },
        error: {type: 'file', filename: path.join(logDir, 'errors.log')}
    },
    categories: {
        default: { appenders: ['main'], level: "error" },
        error: { appenders: ['error'], level: 'error'}
    }
});
