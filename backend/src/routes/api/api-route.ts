import express from "express";
import OpenApiRoute from "./open-api/open-api-route";
import CloseRouter from "./close-api";

import authMiddleware from "./../../middlewares/auth-middleware";
const ApiRouter = express.Router();


ApiRouter.get("/", (req, res) => {
	res.send('api v1')
})

ApiRouter.use('/open-api', OpenApiRoute)

ApiRouter.use(authMiddleware);

ApiRouter.use('/close-api', CloseRouter)

export default ApiRouter;
