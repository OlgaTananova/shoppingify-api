import {Router} from 'express';
import {
    addItemToShoppingListValidationSchema,
    createShoppingListValidationSchema, deleteItemFromSLValidationSchema
} from '../middlewares/schemaValidator';
import {
    createShoppingList,
    getShoppingLists,
    addItemToShoppingList,
    deleteItemFromShoppingList
} from '../controllers/shoppingLists';
import {auth} from "../middlewares/auth";
import {celebrate} from "celebrate";

const router = Router();

router.post('/shoppinglists',
    auth, celebrate(createShoppingListValidationSchema),
    createShoppingList);
router.get('/shoppinglists', auth, getShoppingLists);
router.put('/shoppinglists',auth, celebrate(addItemToShoppingListValidationSchema), addItemToShoppingList )
router.delete('/shoppinglists', auth, celebrate(deleteItemFromSLValidationSchema), deleteItemFromShoppingList);
export default router;
