import { Router } from "express";
import { getTrans } from "../controllers/bank.controller";

const bank = Router()

bank.post('/get-transactions', getTrans)

export default bank