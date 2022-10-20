import { Router, Request, Response } from 'express'
import { signToken } from '../controllers/auth.controller'
import crypto from 'crypto'
import { logger } from '../../utils/logger'
import cbor from 'cbor'
import { QueryDB } from '../../utils/backend/db'

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

auth.get('/device-id', async (req: Request, res: Response):Promise<void> => {
    let challenge;
    logger.debug(req.cookies)
    if(req.cookies?.DeviceUUID) {
        const queryres = await QueryDB(`select Challenge from DeviceInfo where DeviceID = '${req.cookies.DeviceUUID}'`)
        challenge = queryres.recordset[0]?.Challenge
    } else {
        const result = await QueryDB(`INSERT INTO DeviceInfo ( Challenge, userAgent ) OUTPUT inserted.DeviceID VALUES ('${challenge}', '${req.get('user-agent')}')`)
        const UUID = result.recordset?.[0]?.DeviceID
        challenge = crypto.randomBytes(32).toString('hex')
        res.cookie('DeviceUUID', UUID,{
            httpOnly:true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10) // ms * sec * minutes * hours * days * years
        })
    }
        
    res.send({
        challenge: challenge
    })

})

auth.post('/validate', async (req: Request, res: Response): Promise<void> => {
    
    const clientDataJSON = JSON.parse(Buffer.from(req.body.response.clientDataJSON, 'base64').toString())
    const attestationObject = req.body.response.attestationObject


    const UUID = req.cookies.DeviceUUID
    const challenge = (await QueryDB(`select Challenge from DeviceInfo where DeviceID = '${UUID}'`)).recordset[0].Challenge
    if(
        (Buffer.from(clientDataJSON.challenge, 'base64').toString() === challenge) &&
        (clientDataJSON.type === "webauthn.create")
    ) {
        console.log(
            cbor.decodeAllSync(Buffer.from(attestationObject, 'base64'))[0]
        )

        QueryDB(`
            UPDATE [dbo].[DeviceInfo]
                SET
                 [Challenge] = null
                ,[PublicKey] = '${req.body.id}'
                ,[attestationObject] = '${attestationObject}'
                ,[clientDataJSON] = '${JSON.stringify(clientDataJSON)}'
                ,[userAgent] = '${req.get('user-agent')}'
                ,[UserId] = 1
            WHERE DeviceID = '${UUID}'
        `)
    } else {
       // Kill
    }



    res.end()

})

auth.post('/login-biometrics', async (req: Request, res: Response): Promise<void> => {
    
})

export default auth