"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crawler_1 = require("../controllers/crawler");
const router = (0, express_1.Router)();
router.post('/ralphs-get-stores', crawler_1.fetchStores);
router.post('/ralphs-select-store', crawler_1.chooseStore);
router.post('/ralphs-get-products', crawler_1.getProducts);
exports.default = router;
