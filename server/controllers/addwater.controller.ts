import { QueryDB, mssql } from "../utils/db";
import {logger} from "../utils/logger";
import { Router, Request, Response } from "express";

import * as mqtt from 'async-mqtt'
import { publish } from "../utils/mqtt";

interface AddWaterSubmit {
    GigaJoule: number;
    Volume: number;
    date?: string;
}

const mqttAddWater = (data: AddWaterSubmit): void => {
    data.date = (new Date()).toISOString()
    publish('sensor/energy/warm-water', data)
}

export const addWater = (req: Request, res: Response): void => {
    QueryDB(
        `exec InsertRow @Json = '${JSON.stringify(req.body)}', @UsageType = 2`
    ).then((result: mssql.IResult<any>) => {
        mqttAddWater(req.body)
        logger.debug(result);
        res.send(result);
    });
}