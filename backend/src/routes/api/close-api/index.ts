import express from "express";
import GroupRouter from "./group-router";

const CloseRouter = express.Router();

CloseRouter.use('/groups', GroupRouter);

export default CloseRouter;
