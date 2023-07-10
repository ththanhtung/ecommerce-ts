import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import { dbInstance } from './database/init.database'
import { OverloadCheck } from './helpers/check.connection'


const app = express()

// middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init database
const db = dbInstance
OverloadCheck()

app.get('/', (req:Request, res:Response, next:NextFunction)=>{
    const compressStr = "dlfjdlfsfd"
    res.send({
        msg: "success", 
        metadata: compressStr.repeat(100000)
    })
    next()
})



export {
    app
}
