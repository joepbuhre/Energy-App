import { Request, Response } from "express"
import { logger } from "../../utils/logger"
import { getTransactions } from "../models/bank.model"


const getTrans = async (req: Request, res: Response) => {
    const result = await getTransactions()
    const booked = result.transactions.booked
    
    const checks = [
        'ENNATUURLIJK BV'
    ]

    for (let i = 0; i < booked.length; i++) {
        const transaction = booked[i];

        if(checks.includes(transaction?.creditorName)){
            logger.log(transaction)
        }
    }

    res.send(result)
}

export {
    getTrans
}