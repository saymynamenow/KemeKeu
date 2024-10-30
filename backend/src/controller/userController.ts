import { Request, Response } from "express";
import dotenv from 'dotenv'
import { PrismaClient } from "@prisma/client";
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
            res.json({
                message: "Login Success",
                data: response
            })
        })
    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error: error})
    }
}