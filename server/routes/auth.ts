import { Router, Request, Response } from 'express'
import { signToken } from '../controllers/auth.controller'


const auth = Router()

auth.post('/login', (req: Request, res: Response): void => {
    const data = {
        UserID: 'Senna'
    }

    const token = signToken(data)

    res.send({
        token: token
    })
})

export default auth