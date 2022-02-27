import express from "express";

/**
 * Вернёт список комнат
 * */
function get(_req: express.Request, res: express.Response, next: express.NextFunction){
    try {

        res.send('Room');

    } catch (e) {
        next(e);
    }
}
export default {
    get
}
