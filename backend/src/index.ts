import express, {Request, Response} from 'express'
import dotenv from "dotenv"
import { checkApiKey } from './middleware/apiAuth';
import { generateApiKey } from './controller/generateToken';
import { registerUser } from './controller/userController';
import { nlpProcess } from './controller/aiController';
dotenv.config();

const app = express();
const env = process.env
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const apiRouter = express.Router()

apiRouter.post('/generate', generateApiKey)

apiRouter.get('/', checkApiKey, (req: Request,res: Response) =>{
    res.send('Hello Welcome To Api My Amigos, Contact Me in Discord FiqriAnanda')
})

apiRouter.post('/userRegister', registerUser)

apiRouter.post('/nlpProcess', nlpProcess)

app.use('/api', apiRouter)

app.listen(env.DEV_PORT, () =>{
    console.log('Server On Port 3000')
})