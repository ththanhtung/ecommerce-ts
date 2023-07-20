import express from 'express';
import { authentication } from '../../middlewares/authentication';
import { productController } from '../../controllers/product.controller';

const router = express.Router();

router.use(authentication);
router.post('/', productController.createProduct);

router.get('/drafts/all', productController.findAllDraftsForShop);
router.post('/drafts/:id', productController.draftProductByShop);

router.post('/published/:id', productController.publishProductByShop);
router.get('/published/all', productController.findAllPublishedForShop);

export { router };