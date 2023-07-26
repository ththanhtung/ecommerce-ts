import express from 'express'
import { router as authRoutes } from './auth'
import { router as productRoutes } from './product'
import { router as discountRoutes } from './discount'
import { router as cartRoutes } from './cart'
import { router as checkoutRoutes } from './checkout'
import { checkAuth, permission } from '../middlewares/checkAuth'

const router = express.Router()

// check api
router.use(checkAuth)

// check permission
router.use(permission('001'))

router.use('/v1/api/cart', cartRoutes)
router.use('/v1/api/checkout', checkoutRoutes);
router.use('/v1/api/discount', discountRoutes);
router.use('/v1/api/product', productRoutes)
router.use('/v1/api', authRoutes)

export {
    router
}