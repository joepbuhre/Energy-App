import express, { Request, Response, Router } from "express";
import Logger from "./utils/logger";
import cors from "cors";
import * as dotenv from "dotenv";
import query from "./routes/query";
import auth from "./routes/auth";
import { isLoggedIn } from "./controllers/auth.controller";
import cookieParser from 'cookie-parser'
import init from "./models/preparedb.model";
import bank from "./routes/bank";

dotenv.config({
    path: __dirname + '/.env'
});
console.log(process.env.DB_NAME)
const logger = new Logger("SILLY");

const app = express();
const port = 5000;

app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser())

const router = Router();

router.use("/auth", auth);

router.use("*", isLoggedIn);

router.use("/query", query);

router.use('/bank', bank)

router.get("/", (req: Request, res: Response) => {
    res.json({ greeting: "Hello world!" });
});

app.use("/api", router);

init().then(res => {
    logger.log('DB Migration are succesful')
    app.listen(port, () => {
        logger.log(`🚀 server started at http://localhost:${port}`);
    });    
})