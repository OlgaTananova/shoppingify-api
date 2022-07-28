import {Router} from 'express';
import {createItem, getItemById, getItems, deleteItem} from "../controllers/items";
import {celebrate} from "celebrate";
import {
    createItemValidationSchema,
    deleteItemValidationSchema,
    getItemByIdValidationSchema
} from "../middlewares/schemaValidator";

const router = Router();

router.post('/items', celebrate(createItemValidationSchema), createItem);
router.get('/items', getItems);
router.get('/items/:id', celebrate(getItemByIdValidationSchema), getItemById);
router.delete('/items/:id', celebrate(deleteItemValidationSchema), deleteItem);

export default router;
