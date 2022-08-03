import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import express, {Express, Response, Request} from "express";
import cors from 'cors';
import routes from "./routes";
import {generalErrorHandler, celebrateErrorHandler} from "./middlewares/errorHandler";
import cookieParser from "cookie-parser";

const app: Express = express();

const { PORT = 3000 } = process.env;

async function start() {
   await mongoose.connect('mongodb://localhost:27017/shoppingify_dev');
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
        }))
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cookieParser())
        routes(app);
        app.use(celebrateErrorHandler);
        app.use(generalErrorHandler);
    })
    .catch((e)=>{
      console.log(e)
    })


