"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const { PORT = 3000, MONGO_URI } = process.env;
// async function start() {
//     await
mongoose_1.default.connect(MONGO_URI || 'mongodb://localhost:27017/shoppingify_dev');
app_1.default.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});
// }
//
// start()
// .then(()=>{
//     app.use(app)
// })
