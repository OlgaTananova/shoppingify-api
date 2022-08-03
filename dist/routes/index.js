"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categories_1 = __importDefault(require("../routes/categories"));
const items_1 = __importDefault(require("../routes/items"));
const users_1 = __importDefault(require("../routes/users"));
const routes = (app) => {
    app.use(categories_1.default);
    app.use(items_1.default);
    app.use(users_1.default);
};
exports.default = routes;
