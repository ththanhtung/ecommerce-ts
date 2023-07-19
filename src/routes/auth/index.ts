import express from 'express'
import { authController } from '../../controllers/auth.controller'
import { authentication } from '../../middlewares/authentication';

const router = express.Router()

router.post('/shop/auth/signup', authController.signup)
router.post('/shop/auth/login', authController.login);
router.post('/shop/auth/refeshtoken', authController.RefeshToken)

router.use(authentication)
router.post('/shop/auth/logout', authController.Logout)

export {
    router
}