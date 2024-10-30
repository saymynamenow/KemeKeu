import { Request,Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY;

if(!SECRET_KEY){
    throw new Error("JWT_SECRET Must Defined")
}

export const checkApiKey = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization']

    if(!authHeader || typeof authHeader !== 'string'){
        res.status(403).json({ message: 'Forbidden: No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1]
    
    if(!token){
        res.status(400).json({message: "Token Not Provide"})
    }

    jwt.verify(token, SECRET_KEY, (err, decode) =>{
        if(err){
            return res.status(401).json({message: "Unauthorized: Invalid token"})
        }

        if(decode && typeof decode == 'object'){
        next();
        }
    })
}