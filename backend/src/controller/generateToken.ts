import { Request, Response } from "express";
import jwt  from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY;


if(!SECRET_KEY){
    throw new Error("JWT must be Required")
}

export const generateApiKey = (req: Request, res:Response) => {
    const token = jwt.sign({key: "You Are My World"}, SECRET_KEY, {expiresIn: '24h'});
    res.json({token})
}