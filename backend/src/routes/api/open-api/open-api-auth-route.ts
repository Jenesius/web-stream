import express from "express";
import AuthController from "./../../../controllers/auth-controller";

const OpenApiAuthRoute = express.Router()

OpenApiAuthRoute.post('/login', AuthController.login);
OpenApiAuthRoute.post('/registration', AuthController.registration);

export default OpenApiAuthRoute
