import express from "express";
import OpenApiRoute from "./open-api/open-api-route";

const ApiRouter = express.Router();

ApiRouter.get("/", (req, res) => {
	res.send('api v1')
})

ApiRouter.use('/open', OpenApiRoute)

export default ApiRouter;
