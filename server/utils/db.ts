import mssql, {config} from 'mssql'
import { logger } from './logger';
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs';
import { resolve } from 'path';


dotenv.config({
    path: 'server/.env'
})
// Config your database credential
const mssqlconfig:config = {
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    server: process.env.DB_SERVER as string,
    port: parseInt(process.env.DB_PORT || '1433'),
    database: process.env.DB_NAME as string,
    options: {
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
};

// Connect to your database
const QueryDB = (query: any) : Promise<mssql.IResult<any>> => {
    return new Promise((resolve, reject) => {
        mssql.connect(mssqlconfig, (err) => {
            if(err) {
                reject(err)
                logger.warn(err)
                return
            }
    
            resolve(mssql.query(query))
    
        })
    })
}

const createConn = (): Promise<mssql.ConnectionPool|undefined> => {
    return new mssql.ConnectionPool(mssqlconfig)
        .connect()
        .then(pool => {
        console.log('Connected to MSSQL')
        return pool
        })
        .catch(err => {
            console.log('Database Connection Failed! Bad Config: ', err)
            return undefined
        })
}

export { QueryDB, mssql, createConn }