import dotenv from 'dotenv';
dotenv.config();
import express, {Express} from "express";
import cors from 'cors';
import routes from "./routes";
import {generalErrorHandler, celebrateErrorHandler} from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import {errorLogger, requestLogger} from "./middlewares/logger";
import helmet from "helmet";
import {limiter} from "./middlewares/limiter";

const app: Express = express();

app.use(cors({
    origin: ['http://localhost:3001',
        'http://localhost:3000',
        'https://olgatananova.github.io/shoppingify'
    ],
    credentials: true,
}));
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
routes(app);
app.use(errorLogger);
app.use(celebrateErrorHandler);
app.use(generalErrorHandler);

export default app;
