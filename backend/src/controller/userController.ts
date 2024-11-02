import { Request, Response } from "express";
import dotenv from 'dotenv'
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
dotenv.config();

const env = process.env;
const prisma = new PrismaClient()


export const registerUser = async(req: Request, res: Response):Promise<void> =>{
    var {username, password, visi, misi, kbli, ntb, location, userType} = req.body;
    if(!username || !password || !visi || !misi || !kbli || !ntb || !location || !userType){
        res.status(400).json({message: "All Fields Must Be Filled"})
        return
    }
    try {
        const validationUser = await prisma.user.findFirst({
            where: {
                username: username
            }
        })
        
        if(!validationUser){
            res.status(400).json({message: "Username Already Exist"})
            return
        }

        await prisma.user.create({
            data: {
                username: username,
                password: password,
                visi: visi,
                misi: misi,
                KBLI: kbli,
                NTB: ntb,
                Location: location,
                usertype: {connect: {typeId: parseInt(userType)}}
            }
        }).then((response) =>{
            res.json({
                message: "User Registered",
                data: response
            })
        })
    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error: error})
    }
    
}

export const loginUser = async(req: Request, res: Response):Promise<void> =>{
    const {username, password} = req.body;
    if(!username || !password){
        res.status(400).json({message: "All Fields Must Be Filled"})
        return
    }
    try {
        await prisma.user.findFirst({
            where: {
                username: username
            }
        }).then((response) =>{
            if(!response){
                res.status(404).json({message: "User Not Found"})
                return
            }
            if(response.password !== password){
                res.status(401).json({message: "Password Incorrect"})
                return
            }
            if (!env.SECRET_KEY) {
                throw new Error("SECRET_KEY is not defined in the environment variables.");
              }
            res.json({
                message: "Login Success",
                token: jwt.sign({username: response.username, id: response.userId, role: response.typeId}, env.SECRET_KEY)
            })
        })
    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error: error})
    }
}

export const userData = async(req: Request, res: Response):Promise<void> =>{
    try {
        await prisma.user.findMany().then((response) =>{
            res.json({
                message: "User Data",
                data: response
            })
        })
    } catch (error) {
        res.status(500).json({message: "Internal Sever Error", error: error})
    }
}

export const changeUserStatus = async(req: Request, res: Response):Promise<void> =>{
    try {
        const {userId} = req.body;
        if(!userId){
            res.status(400).json({message: "UserId Must Be Filled"})
            return
        }

        await prisma.user.update({
            where: {
                userId: parseInt(userId)
            },
            data: {
                isVerified: true
            }
        }).then((response) =>{
            res.json({
                message: "User Verified",
            })
        })
    } catch (error) {
        res.status(500).json({message: "Internal Sever Error", error: error})
        console.log(error)
    }
}