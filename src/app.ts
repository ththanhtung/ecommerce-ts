import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import { dbInstance } from './database/init.database'
import { OverloadCheck } from './helpers/check.connection'
import { router } from './routes'
import { errorHandler } from './middlewares/errorsHander'
import cors from 'cors'


const app = express()

// middlewares
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(
  cors({
    origin: "*",
    // credentials: true,
  })
);

// init database
const db = dbInstance
// OverloadCheck()

// init routes
app.use(router)

app.use(errorHandler)

export {
    app
}
