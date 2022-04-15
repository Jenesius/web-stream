import express from "express";
import OpenApiAuthRoute from "./open-api-auth-route";
const OpenApiRoute = express.Router();

OpenApiRoute.get('/', ((req, res) => {
	console.log('+')
	res.send('open-api')
}))
OpenApiRoute.use('/auth', OpenApiAuthRoute);

export default OpenApiRoute;
