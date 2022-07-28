import {Router} from 'express';
import {addItemToCategory, createCategory, deleteItemFromCategory, getCategories} from "../controllers/category";
import {celebrate} from "celebrate";
import {
    createCategoryValidationSchema,
    addItemToCategoryValidationSchema,
    deleteItemFromCategoryValidationSchema
} from "../middlewares/schemaValidator";

const router = Router();

router.post('/categories', celebrate(createCategoryValidationSchema), createCategory);
router.put('/categories/items', celebrate(addItemToCategoryValidationSchema), addItemToCategory);
router.get('/categories', getCategories);
router.delete('/categories/items', celebrate(deleteItemFromCategoryValidationSchema), deleteItemFromCategory);


export default router;
