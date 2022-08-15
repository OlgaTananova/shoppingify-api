import {Router} from 'express';
import {
    addItemToShoppingListValidationSchema,
    createShoppingListValidationSchema,
    deleteItemFromSLValidationSchema,
    updateItemQtyInSLValidationSchema,
    updateItemStatusInSLValidationSchema, updateSLHeadingValidationSchema
} from '../middlewares/schemaValidator';
import {
    createShoppingList,
    getShoppingLists,
    addItemToShoppingList,
    deleteItemFromShoppingList, changeItemQuantity, changeItemStatus, changeSLHeading
} from '../controllers/shoppingLists';
import {auth} from "../middlewares/auth";
import {celebrate} from "celebrate";

const router = Router();

router.post('/shoppinglists',
    auth, celebrate(createShoppingListValidationSchema),
    createShoppingList);
router.get('/shoppinglists', auth, getShoppingLists);
router.put('/shoppinglists',auth, celebrate(addItemToShoppingListValidationSchema), addItemToShoppingList )
router.patch('/shoppinglists/updqty',auth, celebrate(updateItemQtyInSLValidationSchema), changeItemQuantity);
router.patch('/shoppinglists/updstatus', auth, celebrate(updateItemStatusInSLValidationSchema), changeItemStatus);
router.patch('/shoppinglists/updheading', auth, celebrate(updateSLHeadingValidationSchema), changeSLHeading);
router.delete('/shoppinglists', auth, celebrate(deleteItemFromSLValidationSchema), deleteItemFromShoppingList);
export default router;
