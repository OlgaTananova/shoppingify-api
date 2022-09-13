import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import express, {Express} from "express";
import cors from 'cors';
import routes from "./routes";
import {generalErrorHandler, celebrateErrorHandler} from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";
import {errorLogger, requestLogger} from "./middlewares/logger";
import helmet from "helmet";
import {limiter} from "./middlewares/limiter";

const app: Express = express();

const { PORT = 3000, MONGO_URI } = process.env;

async function start() {
   await mongoose.connect(MONGO_URI || 'mongodb://localhost:27017/shoppingify_dev');
      app.listen(PORT, () => {
        console.log(`App listening on PORT ${PORT}`);
      });
}

start()
    .then(()=>{
        app.use(cors({
            origin: ['http://localhost:3001',
                'http://localhost:3000'
            ],
            credentials: true,
        }));
        app.use(helmet());
        app.use(requestLogger);
        app.use(limiter);
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser())
        routes(app);
        app.use(errorLogger);
        app.use(celebrateErrorHandler);
        app.use(generalErrorHandler);
    })
    .catch((e)=>{
      console.log(e)
    });


