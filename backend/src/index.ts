import express, {Request, Response} from 'express'
import dotenv from "dotenv"
import { checkApiKey } from './middleware/apiAuth';
import { checkAuthKey, checkAdminAuth } from './middleware/userAuth';
import { generateApiKey } from './controller/generateToken';
import { registerUser, loginUser, userData, changeUserStatus } from './controller/userController';
import { nlpProcess, dummyData } from './controller/aiController';
dotenv.config();

const app = express();
const env = process.env
app.use(express.json())
app.use(express.urlencoded({extended: true}))
const apiRouter = express.Router()

// apiRouter.post('/generate', generateApiKey)
// apiRouter.post('/generateDummy', dummyData)

apiRouter.get('/', checkApiKey, checkAuthKey, (req: Request,res: Response) =>{
    res.send('Hello Welcome To Api My Amigos')
})

apiRouter.post('/userRegister', registerUser)
apiRouter.post('/userLogin', loginUser)
apiRouter.post('/nlpProcess', checkApiKey, checkAuthKey, nlpProcess)

apiRouter.get('/userData', checkApiKey, checkAdminAuth, userData)
apiRouter.put('/verifiedUser', checkApiKey, checkAdminAuth, changeUserStatus)

app.use('/api', apiRouter)

app.listen(env.DEV_PORT, () =>{
    console.log('Server On Port 3000')
})