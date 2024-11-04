# API KEMENKEU

This is API for Gov AI Hackaton


### MODEL
> OpenAI | GPT-4o

### END POINT LIST
| Endpoint          | Usage                                                                                       |
|-------------------|---------------------------------------------------------------------------------------------|
| /api/userRegister | Register User with parameter {username, password, visi, misi, KBLI, NTB, Location, userType}|
| /api/userLogin    | Login user with parameter {username, passowrd}                                              |
| /api/nlpProcess   | NLP to short from related to unrelated userId by Vision And Mission User                    |

### Instalation
```
1. Clone this github Project.
2. Install package by following this line
 > npm i
3. Setup the enviorment in this path
  > ./backend/
  > ./backend/prisma
4. AFter setup the enviorment run command to migrate the database
  > npx prisma migrate dev
5. Run this project using nodemon or node
  > nodemon .\src\index.ts
```

### Note
This is only API for search id with NLP Process


### AUTHOR CODE
- Nexel
