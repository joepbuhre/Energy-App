import { Router, Request, Response } from 'express'
import { QueryDB } from '../../utils/backend/db'
import { logger } from '../../utils/logger'
import mssql from 'mssql'


const query = Router()

query.post('/', (req: Request, res: Response): void => {
    
    QueryDB(req.body.query).then((result:mssql.IResult<any>) => {
        logger.log(result)
        res.send(result.recordsets)
    })


})

query.post('/AddWater', (req: Request, res: Response): void => {

    // const body = {
    //     GigaJoule: null,
    //     Volume: null
    // }

    QueryDB(`exec InsertRow @Json = '${JSON.stringify(req.body)}', @UsageType = 2`).then((result: mssql.IResult<any>) => {
        logger.debug(result) 
        res.send(result)
    })

})

export default query