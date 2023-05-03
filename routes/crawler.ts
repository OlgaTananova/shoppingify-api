import {Router} from 'express';
import {chooseStore, fetchStores, getProducts} from "../controllers/crawler";

const router = Router();

router.post('/ralphs-get-stores', fetchStores);
router.post('/ralphs-select-store', chooseStore);
router.post('/ralphs-get-products', getProducts);

export default router;
