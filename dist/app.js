"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = require("./middlewares/logger");
const helmet_1 = __importDefault(require("helmet"));
const limiter_1 = require("./middlewares/limiter");
const app = (0, express_1.default)();
const { PORT = 3000, MONGO_URI } = process.env;
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(MONGO_URI || 'mongodb://localhost:27017/shoppingify_dev');
        app.listen(PORT, () => {
            console.log(`App listening on PORT ${PORT}`);
        });
    });
}
start()
    .then(() => {
    app.use((0, cors_1.default)({
        origin: ['http://localhost:3001',
            'http://localhost:3000'
        ],
        credentials: true,
    }));
    app.use((0, helmet_1.default)());
    app.use(logger_1.requestLogger);
    app.use(limiter_1.limiter);
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    (0, routes_1.default)(app);
    app.use(logger_1.errorLogger);
    app.use(errorHandler_1.celebrateErrorHandler);
    app.use(errorHandler_1.generalErrorHandler);
})
    .catch((e) => {
    console.log(e);
});
