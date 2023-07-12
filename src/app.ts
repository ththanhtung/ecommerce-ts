import express, { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import { dbInstance } from './database/init.database'
import { OverloadCheck } from './helpers/check.connection'
import { router } from './routes'


const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init database
const db = dbInstance
// OverloadCheck()

// init routes
app.use(router)

export {
    app
}
