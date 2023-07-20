import express from 'express'
import { router as authRoutes } from './auth'
import { router as productRoutes } from './product'
import { checkAuth, permission } from '../middlewares/checkAuth'

const router = express.Router()

// check api
router.use(checkAuth)

// check permission
router.use(permission('001'))

router.use('/v1/api', authRoutes)
router.use('/v1/api/product', productRoutes)

export {
    router
}