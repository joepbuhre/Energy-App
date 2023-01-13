import { Router, Request, Response } from "express";
import { QueryDB } from "../utils/db";
import { logger } from "../utils/logger";
import mssql from "mssql";
import bankapi from '../utils/nordigen'
import { addWater } from "../controllers/addwater.controller";

const query = Router();

query.post("/", (req: Request, res: Response): void => {
    QueryDB(req.body.query).then((result: mssql.IResult<any>) => {
        logger.log(result);
        res.send(result.recordsets);
    });
});

query.post("/AddWater", addWater);

query.get("/tset", (req: Request, res: Response): void => {
    bankapi.get('/test')
});

export default query;
