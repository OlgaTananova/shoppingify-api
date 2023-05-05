"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
let PORT = process.env['PORT'] || 3000;
let MONGO_URI = process.env["MONGO_URI"] || "mongodb://localhost:27017/shoppingify_dev";
mongoose_1.default.connect(MONGO_URI);
app_1.default.listen(PORT, () => {
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
