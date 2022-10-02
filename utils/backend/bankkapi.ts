import axios, { AxiosInstance } from "axios";
import * as dotenv from 'dotenv'
import { IResult } from "mssql";
import {QueryDB} from '../../utils/backend/db'

dotenv.config({
    path: 'server/.env'
})


const bankBearer = await QueryDB('select dbo._iu_fn_GetConfig(\'BankBearer\')')
const bankapi: AxiosInstance = axios.create({
    baseURL: 'https://ob.nordigen.com/api/v2/accounts/8b5bfd18-4ffe-4e4c-b430-bde700a55801',
    headers: {
        'Authorization': `Bearer ${bankBearer}`
    }

})


export default bankapi