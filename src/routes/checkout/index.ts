import express from 'express';
import { authentication } from '../../middlewares/authentication';
import { checkoutController } from '../../controllers/checkout.controller';

const router = express.Router();

router.use(authentication);
router.post('/preview', checkoutController.checkoutPreview);

export { router };
