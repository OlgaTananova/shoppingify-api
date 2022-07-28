import categoriesRouter from '../routes/categories';
import itemsRouter from '../routes/items';
import {Express} from "express";

const routes = (app: Express) => {
    app.use(categoriesRouter);
    app.use(itemsRouter);
}

export default routes;
