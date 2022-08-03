import categoriesRouter from '../routes/categories';
import itemsRouter from '../routes/items';
import usersRouter from '../routes/users';
import {Express} from "express";

const routes = (app: Express) => {
    app.use(categoriesRouter);
    app.use(itemsRouter);
    app.use(usersRouter);
}

export default routes;
