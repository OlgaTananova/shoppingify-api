import {Router} from 'express';
import {
    addItemToShoppingListValidationSchema,
    createShoppingListValidationSchema,
    deleteItemFromSLValidationSchema,
    mergeBillValidationSchema,
    mergeSLValidationSchema,
    updateItemQtyInSLValidationSchema,
    updateItemStatusInSLValidationSchema, updateItemUnitsInSLValidationSchema,
    updateSLHeadingValidationSchema,
    updateSLStatusValidationSchema
} from '../middlewares/schemaValidator';
import {
    createShoppingList,
    getShoppingLists,
    addItemToShoppingList,
    deleteItemFromShoppingList,
    changeItemQuantity,
    changeItemStatus,
    changeSLHeading,
    changeSLStatus,
    uploadBill,
    mergeLists, uploadList, changeItemUnits
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
router.patch('/shoppinglists/updslstatus', auth, celebrate(updateSLStatusValidationSchema), changeSLStatus);
router.patch('/shoppinglists/updItemUnits', auth,celebrate(updateItemUnitsInSLValidationSchema), changeItemUnits);
router.delete('/shoppinglists', auth, celebrate(deleteItemFromSLValidationSchema), deleteItemFromShoppingList);
router.post('/upload-bill', auth, uploadBill);
router.post('/merge-lists', auth, celebrate(mergeSLValidationSchema), mergeLists);
router.post('/upload-list', auth, celebrate (mergeBillValidationSchema), uploadList);
export default router;
