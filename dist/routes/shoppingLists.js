"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shoppingLists_1 = require("../controllers/shoppingLists");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/shoppinglists', 
// auth, celebrate(createShoppingListValidationSchema),
shoppingLists_1.createShoppingList);
router.get('/shoppinglists', auth_1.auth, shoppingLists_1.getShoppingLists);
exports.default = router;
