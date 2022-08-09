import {Router} from 'express';
import {createShoppingListValidationSchema} from '../middlewares/schemaValidator';
import {createShoppingList, getShoppingLists} from '../controllers/shoppingLists';
import {auth} from "../middlewares/auth";
import {celebrate} from "celebrate";

const router = Router();

router.post('/shoppinglists',
    // auth, celebrate(createShoppingListValidationSchema),
    createShoppingList);
router.get('/shoppinglists', auth, getShoppingLists);

export default router;
