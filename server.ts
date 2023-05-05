import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
import app from './app';

let PORT: string | number = process.env['PORT'] || 3000;
let MONGO_URI: string = process.env["MONGO_URI"] || "mongodb://localhost:27017/shoppingify_dev";

mongoose.connect(MONGO_URI);
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
})
    .on("error", function (err) {
        process.once("SIGUSR2", function () {
            process.kill(process.pid, "SIGUSR2");
        });
        process.on("SIGINT", function () {
            // this is only called on ctrl+c, not restart
            process.kill(process.pid, "SIGINT");
        });
    });

