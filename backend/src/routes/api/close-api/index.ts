import express from "express";
import GroupRouter from "./group-router";
import UsersRouter from "./users-router";

const CloseRouter = express.Router();

CloseRouter.use('/groups', GroupRouter);
CloseRouter.use('/users', UsersRouter);

export default CloseRouter;
