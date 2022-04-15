import {Express} from "express";
import ApiRouter from "./api/api-route";

export function useRouter(app: Express) {
	
	app.use('/api', ApiRouter)
	
}
