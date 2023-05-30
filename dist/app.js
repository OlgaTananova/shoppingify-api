"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = require("./middlewares/logger");
const helmet_1 = __importDefault(require("helmet"));
const limiter_1 = require("./middlewares/limiter");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:3001',
        'http://localhost:3000',
        'https://olgatananova.github.io',
        'http://shoppingify.info',
        'https://shoppingify.info',
        'http://192.168.0.193:3000',
        'http://172.20.10.6:3000'
    ],
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use(logger_1.requestLogger);
app.use(limiter_1.limiter);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)());
app.use('/upload-bill', express_1.default.static('upload-bill'));
app.use((0, cookie_parser_1.default)());
(0, routes_1.default)(app);
app.use(logger_1.errorLogger);
app.use(errorHandler_1.celebrateErrorHandler);
app.use(errorHandler_1.generalErrorHandler);
exports.default = app;
