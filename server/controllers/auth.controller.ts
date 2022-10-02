import jwt from "jsonwebtoken";
import { Router, Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    const bearer = req?.headers?.authorization?.split(" ");
    if (bearer === undefined && req?.headers?.["x-api-key"]) {
        if (req.headers["x-api-key"] === process.env.API_TOKEN) {
            next()
        } else {
            res.status(403).send({
                message: "Not authorized",
            });
        }
        return;
    }

    jwt.verify(
        bearer?.[1] as string,
        process.env.SECRET_TOKEN as jwt.Secret,
        (err: any, decoded: any) => {
            logger.debug(err, decoded);

            if (err) {
                res.status(403).send({
                    message: "Not authorized",
                });
            } else {
                next();
            }
        }
    );
};

const signToken = (data: any) => {
    const token = jwt.sign(data, process.env.SECRET_TOKEN as string, {
        expiresIn: "7d",
        algorithm: "HS256",
    });
    return token;
};

export { isLoggedIn, signToken };
