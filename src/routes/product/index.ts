import express from 'express'
import { authentication } from '../../middlewares/authentication'
import { productController } from '../../controllers/product.controller'

const router = express.Router()


router.use(authentication)
router.post('/', productController.createProduct)

export {
    router
}