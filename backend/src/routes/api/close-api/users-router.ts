import express from "express";
import UserController from "../../../controllers/user-controller";
const UsersRouter = express.Router();

UsersRouter.get('/', UserController.getList)
UsersRouter.get('/:id', UserController.get);


export default UsersRouter;
