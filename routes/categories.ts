import {Router} from 'express';
import {addItemToCategory, createCategory, deleteItemFromCategory, getCategories} from "../controllers/categories";
import {celebrate} from "celebrate";
import {
    createCategoryValidationSchema,
    addItemToCategoryValidationSchema,
    deleteItemFromCategoryValidationSchema
} from "../middlewares/schemaValidator";
import {auth} from "../middlewares/auth";

const router = Router();

router.post('/categories', auth, celebrate(createCategoryValidationSchema), createCategory);
router.put('/categories/items', auth, celebrate(addItemToCategoryValidationSchema), addItemToCategory);
router.get('/categories', auth, getCategories);
router.delete('/categories/items', auth, celebrate(deleteItemFromCategoryValidationSchema), deleteItemFromCategory);


export default router;
