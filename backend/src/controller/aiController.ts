import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai"
import dotenv from 'dotenv'



dotenv.config();
const env = process.env;

const token = env.AI_TOKEN
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o";
const client = new OpenAI({
    baseURL: endpoint,
    apiKey: token

})
const prisma = new PrismaClient()

export const nlpProcess = async(req: Request, res: Response):Promise<void> =>{

    try {
        if(!(req as any).userId){
            res.status(401).json({message: "Failed To Process Your data"})
            return
        }
        const user  = await prisma.user.findFirst({
            select:{
                userId: true,
                visi: true,
                misi: true,
                typeId: true,
            },
            where:{
                userId: (req as any).userId
            }
        })
        const response = await prisma.user.findMany({
            select:{
                userId: true,
                misi: true,
                visi: true,
                typeId: true
            }
        })
        
        if(!response){
            res.status(404).json({message: "Data Not Found"})
            return
        }
        if(!user){
            res.status(404).json({message: "User Not Found"})
            return
        }
    
        const nlp = await client.chat.completions.create({
            messages: [
            {role: "assistant",content: "You are a helpfull asissten to short all my JSON data userId from related user vision and mission, remember only userId and this my JSON data \n" + JSON.stringify(response) + "\n And give by typeId except" + user.typeId },
            {role: "user", content: "I have vision " + user.visi +", and mission "+ user.misi +" . Remember just give me the all userId from related to unrelated"},            
        ],
            temperature: 1.0,
            max_tokens: 100,
            top_p: 1.0,
            model: modelName,
            response_format:{
                "type" : "json_object"
            }
        })
        var json_data = nlp['choices'][0]['message']['content']
        res.json(json_data)
    } catch (error) {
        res.status(500).json({message: "Internal Server Errors", error: error})
        console.log(error)
        return
        
    }

}

export const dummyData = async(req: Request, res: Response):Promise<void> =>{
    try {
        const nlp = await client.chat.completions.create({
            messages: [
            {role: "system",content: "You are a assitan, help me to give dummy data but in usertype just fill with 1 OR 2 and do what a prompt tell you" },
            {role: "user",content: "Generate for me 20 data {username, password, visi, misi, KBLI, NTB, Location, typeId} in JSON" },
            ],
            temperature: 1.0,
            max_tokens: 100,
            top_p: 1.0,
            model: modelName,
            response_format:{
                "type" : "json_object"
            }
        })

        var json_data = nlp['choices'][0]['message']['content']
        if(json_data !== null){
            console.log(json_data)
            var parsedData = JSON.parse(json_data)
            await prisma.user.createMany({
                data: parsedData.data
            }).then((response) =>{
                res.json(response) 
            })
        }

        
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal Server Error", error: error})
    }
}