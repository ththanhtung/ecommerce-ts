import express from 'express';
import { authentication } from '../../middlewares/authentication';
import { discountController } from '../../controllers/discount.controller';

const router = express.Router();

router.get('/products', discountController.getProductsByDiscount);
router.get('/amount', discountController.getDiscountAmount);

router.use(authentication);
router.post('/', discountController.createNewDiscount);
router.get('/', discountController.getAllDiscountByShopID);
router.delete('/:id', discountController.deleteDiscount);
router.post('/cancel', discountController.cancelDiscount);

export { router };
