import express from "express";
import GroupController from "../../../controllers/group-controller";
const GroupRouter = express.Router()

GroupRouter.post('/', GroupController.create);

export default GroupRouter;
