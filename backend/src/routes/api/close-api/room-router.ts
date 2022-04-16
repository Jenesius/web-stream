import express from "express";
const RoomRouter = express.Router();

RoomRouter.get('/');

RoomRouter.get('/:id');
RoomRouter.post('/:id');
RoomRouter.delete('/:id');
RoomRouter.put('/:id');

export default RoomRouter;
