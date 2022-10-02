import express, { Request, Response, Router } from "express";
import Logger from "../utils/logger";
import cors from "cors";
import * as dotenv from "dotenv";
import query from "./routes/query";
import auth from "./routes/auth";
import { isLoggedIn } from "./controllers/auth.controller";

dotenv.config({
    path: __dirname + '/.env'
});
console.log(process.env.DB_NAME)
const logger = new Logger("SILLY");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const router = Router();

router.use("/auth", auth);

router.use("*", isLoggedIn);

router.use("/query", query);

router.get("/", (req: Request, res: Response) => {
    res.json({ greeting: "Hello world!" });
});

app.use("/api", router);

app.listen(port, () => {
    logger.log(`🚀 server started at http://localhost:${port}`);
});
