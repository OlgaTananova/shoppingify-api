import {Router} from 'express';
import {createItem, getItemById, getItems, deleteItem, updateItem} from "../controllers/items";
import {celebrate} from "celebrate";
import {
    createItemValidationSchema,
    deleteItemValidationSchema,
    getItemByIdValidationSchema
} from "../middlewares/schemaValidator";
import {auth} from "../middlewares/auth";

const router = Router();

router.post('/items', auth, celebrate(createItemValidationSchema), createItem);
router.get('/items', auth, getItems);
router.get('/items/:id', auth, celebrate(getItemByIdValidationSchema), getItemById);
router.delete('/items/:id', auth, celebrate(deleteItemValidationSchema), deleteItem);
router.patch('/items/:id', auth, celebrate(createItemValidationSchema), updateItem);

export default router;
