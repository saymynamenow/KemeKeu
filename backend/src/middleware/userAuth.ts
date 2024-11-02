import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();

const env = process.env;

export const checkAuthKey = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization']

    if(!authHeader || typeof authHeader !== 'string'){
        res.status(403).json({ message: 'Forbidden: No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1]
    
    if(!token){
        res.status(400).json({message: "Token Not Provide"})
    }
    if (!env.SECRET_KEY) {
        throw new Error("SECRET_KEY is not defined in the environment variables.");
    }

    jwt.verify(token, env.SECRET_KEY, (err, decode) =>{
        if(err){
            return res.status(401).json({message: "Unauthorized: Invalid token"})
        }

        if(decode && typeof decode == 'object'){
        (req as any).userId = decode.id
        next();
        }
    })
}