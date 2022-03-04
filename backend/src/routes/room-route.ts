import express from "express";
import roomController from "./../controllers/room.controller";

const RoomRoute = express.Router();

RoomRoute.get('/', roomController.get)

export default RoomRoute;
