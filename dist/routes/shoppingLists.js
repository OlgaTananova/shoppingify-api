"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schemaValidator_1 = require("../middlewares/schemaValidator");
const shoppingLists_1 = require("../controllers/shoppingLists");
const auth_1 = require("../middlewares/auth");
const celebrate_1 = require("celebrate");
const router = (0, express_1.Router)();
router.post('/shoppinglists', auth_1.auth, (0, celebrate_1.celebrate)(schemaValidator_1.createShoppingListValidationSchema), shoppingLists_1.createShoppingList);
router.get('/shoppinglists', auth_1.auth, shoppingLists_1.getShoppingLists);
router.put('/shoppinglists', auth_1.auth, (0, celebrate_1.celebrate)(schemaValidator_1.addItemToShoppingListValidationSchema), shoppingLists_1.addItemToShoppingList);
router.patch('/shoppinglists/updqty', auth_1.auth, (0, celebrate_1.celebrate)(schemaValidator_1.updateItemQtyInSLValidationSchema), shoppingLists_1.changeItemQuantity);
router.patch('/shoppinglists/updstatus', auth_1.auth, (0, celebrate_1.celebrate)(schemaValidator_1.updateItemStatusInSLValidationSchema), shoppingLists_1.changeItemStatus);
router.patch('/shoppinglists/updheading', auth_1.auth, (0, celebrate_1.celebrate)(schemaValidator_1.updateSLHeadingValidationSchema), shoppingLists_1.changeSLHeading);
router.patch('/shoppinglists/updslstatus', auth_1.auth, (0, celebrate_1.celebrate)(schemaValidator_1.updateSLStatusValidationSchema), shoppingLists_1.changeSLStatus);
router.delete('/shoppinglists', auth_1.auth, (0, celebrate_1.celebrate)(schemaValidator_1.deleteItemFromSLValidationSchema), shoppingLists_1.deleteItemFromShoppingList);
router.post('/upload-bill', auth_1.auth, shoppingLists_1.uploadBill);
router.post('/merge-lists', auth_1.auth, shoppingLists_1.mergeLists);
exports.default = router;
