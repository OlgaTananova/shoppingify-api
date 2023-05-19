import {Router} from 'express';
import {
    addItemToShoppingListValidationSchema,
    createShoppingListValidationSchema,
    deleteItemFromSLValidationSchema, deleteSLValidationSchema,
    mergeBillValidationSchema,
    mergeSLValidationSchema, updateItemPriceInSLValidationSchema,
    updateItemQtyInSLValidationSchema,
    updateItemStatusInSLValidationSchema, updateItemUnitsInSLValidationSchema, updateSalesTaxValidationSchema,
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
    mergeLists, uploadList, changeItemUnits, changeItemPrice, changeSalesTax, deleteShoppingList
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
router.patch('/shoppinglists/updItemPrice', auth, celebrate(updateItemPriceInSLValidationSchema), changeItemPrice);
router.delete('/shoppinglists', auth, celebrate(deleteItemFromSLValidationSchema), deleteItemFromShoppingList);
router.delete('/shoppinglists/deleteList', auth, celebrate(deleteSLValidationSchema), deleteShoppingList);
router.post('/upload-bill', auth, uploadBill);
router.post('/merge-lists', auth, celebrate(mergeSLValidationSchema), mergeLists);
router.post('/upload-list', auth, celebrate (mergeBillValidationSchema), uploadList);
router.patch('/shoppinglists/updSalesTax', auth, celebrate(updateSalesTaxValidationSchema), changeSalesTax);
export default router;
