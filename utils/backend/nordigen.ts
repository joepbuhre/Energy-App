import axios, { AxiosInstance, AxiosResponse } from "axios";
import * as dotenv from "dotenv";
import { IResult } from "mssql";
import { logger } from "../logger";
import { createConn, mssql, QueryDB } from "./db";
import FormData from "form-data";

dotenv.config({
    path: "server/.env",
});

// const bankBearer = await QueryDB('select dbo._iu_fn_GetConfig(\'BankBearer\')')
const bankapi: AxiosInstance = axios.create({
    baseURL:
        "https://ob.nordigen.com/api/v2/accounts/8b5bfd18-4ffe-4e4c-b430-bde700a55801",
});

type configObject = {
    NORDIGEN_SECRET_KEY: string;
    NORDIGEN_SECRET_ID: string;
};

const setBearer = (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const conn = await createConn();
        const config: configObject = await new mssql.Request(conn)
            .query(
                `select 
                 dbo._iu_fn_GetConfig('nordigen_secret_key') [NORDIGEN_SECRET_KEY]
                ,dbo._iu_fn_GetConfig('nordigen_secret_id') [NORDIGEN_SECRET_ID]`
            )
            .then((res) => {
                return res.recordset[0];
            })
            .catch((err) => {
                logger.warn(err);
                return {};
            });
        const form = new FormData();
        form.append("secret_key", config.NORDIGEN_SECRET_KEY);
        form.append("secret_id", config.NORDIGEN_SECRET_ID);

        axios
            .post("https://ob.nordigen.com/api/v2/token/new/", form)
            .then((res) => {
                resolve(res.data.access);
            })
            .catch((err) => {
                logger.warn(err.response);
                reject('');
            });
    });
};

bankapi.interceptors.request.use(async (config) => {
    logger.debug(process.env.NORDIGEN_BEARER)
    if (!process.env.NORDIGEN_BEARER) {
        logger.debug('creating bearer')
        process.env.NORDIGEN_BEARER = await setBearer();
    }
    if(config.headers) {
        config.headers['Authorization'] = `Bearer ${process.env.NORDIGEN_BEARER}`

    }
    return config;
});

export default bankapi;
