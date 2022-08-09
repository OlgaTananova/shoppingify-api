import {Router} from 'express';
import {createCategory, getCategories} from "../controllers/categories";
import {celebrate} from "celebrate";
import {
    createCategoryValidationSchema
} from "../middlewares/schemaValidator";
import {auth} from "../middlewares/auth";

const router = Router();

router.post('/categories', auth, celebrate(createCategoryValidationSchema), createCategory);
router.get('/categories', auth, getCategories);

export default router;
