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
        const response = await prisma.user.findMany()
        
        if(!response){
            res.status(404).json({message: "Data Not Found"})
            return
        }
    
        const nlp = await client.chat.completions.create({
            messages: [
            {role: "system",content: "You are a assitan, and you task is help search in my input JSON me sort vision and mission from related topic to unrelated topic with condition the typeId is 1 OR 2. And just List me the userID of that data Just userID without anything else, remember chat just give me userID and short from related to unrelated" },
            {role: "user",content: "Hello chat i have mission to change world with dictactor way and vision to destroy SandStrom search for me in data below" + JSON.stringify(response) + "Remember just give me userID and short from related to unrelated" },
            ],
            temperature: 1.0,
            max_tokens: 1000,
            top_p: 1.0,
            model: modelName,
        })
    
        res.json({
            message: "NLP Process",
            data: nlp.choices[0].message.content,
            user: response
        })
    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error: error})
        return
        
    }

}