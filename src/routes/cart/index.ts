import express from 'express'
import { authentication } from '../../middlewares/authentication'
import { cartController } from '../../controllers/cart.controller'

const router = express.Router()

router.use(authentication)
router.post('/', cartController.addToCart)
router.get('/', cartController.getCartByUserID)

export {
    router
}