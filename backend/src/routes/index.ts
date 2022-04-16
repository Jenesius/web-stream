import {Express} from "express";
import ApiRouter from "./api/api-route";
import errorMiddleware from "./../middlewares/error-middleware";

export function useRouter(app: Express) {
	
	app.use('/api', ApiRouter)
	
	app.use(errorMiddleware)
	
}
