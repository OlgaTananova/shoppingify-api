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
exports.getProducts = exports.chooseStore = exports.fetchStores = void 0;
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const promises_1 = __importDefault(require("fs/promises"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
function selectStore(selectedStore, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_extra_1.default.launch({ headless: false });
        const page = yield browser.newPage();
        yield page.setViewport({ width: 1520, height: 800 });
        yield page.goto('https://www.ralphs.com/');
        yield page.type('.kds-Input[type="search"]', 'milk');
        yield page.keyboard.press('Enter');
        yield page.click('.CurrentModality-button');
        yield page.waitForSelector('.ReactModal__Content');
        const searchPostCodeButton = yield page.waitForSelector('.PostalCodeSearchBox--drawer');
        yield (searchPostCodeButton === null || searchPostCodeButton === void 0 ? void 0 : searchPostCodeButton.click());
        const input = yield page.waitForSelector('input[data-testid = PostalCodeSearchBox-input]');
        yield (input === null || input === void 0 ? void 0 : input.click({ clickCount: 3 }));
        yield (input === null || input === void 0 ? void 0 : input.type(selectedStore.index));
        yield page.click('.PostalCodeSearchBox-SolitarySearch >>> button');
        yield page.waitForSelector('button[data-testid = ModalityOption-Button-PICKUP]');
        yield page.click('button[data-testid = ModalityOption-Button-IN_STORE]');
        yield page.waitForSelector('.ModalitySelector--StoreSearchResults');
        const chooseStoreButton = yield page.waitForSelector(`button[data-testid = SelectStore-${selectedStore.storeCode}]`);
        yield (chooseStoreButton === null || chooseStoreButton === void 0 ? void 0 : chooseStoreButton.click());
        yield page.waitForTimeout(2000);
        const cookies = yield page.cookies();
        yield promises_1.default.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));
        // const cookiesString = await fs.readFile('./cookies.json');
        // const cookies = JSON.parse(cookiesString);
        // await page.setCookie(...cookies);
        res.status(200).send({ 'message': 'Store selected' });
        yield browser.close();
    });
}
const fetchStores = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { index } = req.body;
    const browser = yield puppeteer_extra_1.default.launch({ headless: false });
    try {
        const page = yield browser.newPage();
        yield page.setViewport({ width: 1520, height: 800 });
        yield page.goto('https://www.ralphs.com/');
        yield page.type('.kds-Input[type="search"]', 'milk');
        yield page.keyboard.press('Enter');
        yield page.click('.CurrentModality-button');
        yield page.waitForSelector('.ReactModal__Content');
        const searchPostCodeButton = yield page.waitForSelector('.PostalCodeSearchBox--drawer');
        yield (searchPostCodeButton === null || searchPostCodeButton === void 0 ? void 0 : searchPostCodeButton.click());
        const input = yield page.waitForSelector('input[data-testid = PostalCodeSearchBox-input]');
        yield (input === null || input === void 0 ? void 0 : input.click({ clickCount: 3 }));
        yield (input === null || input === void 0 ? void 0 : input.type(index));
        yield page.click('.PostalCodeSearchBox-SolitarySearch >>> button');
        yield page.waitForSelector('button[data-testid = ModalityOption-Button-PICKUP]');
        yield page.click('button[data-testid = ModalityOption-Button-IN_STORE]');
        yield page.waitForSelector('.ModalitySelector--StoreSearchResults');
        const response = yield page.$$eval('.ModalitySelector--StoreSearchResults .kds-Card', (elements) => {
            return elements.map((el) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                const storeName = ((_b = (_a = el === null || el === void 0 ? void 0 : el.firstElementChild) === null || _a === void 0 ? void 0 : _a.firstElementChild) === null || _b === void 0 ? void 0 : _b.textContent) || '';
                const address = ((_e = (_d = (_c = el === null || el === void 0 ? void 0 : el.firstElementChild) === null || _c === void 0 ? void 0 : _c.lastElementChild) === null || _d === void 0 ? void 0 : _d.firstElementChild) === null || _e === void 0 ? void 0 : _e.textContent) || '';
                const storeCode = ((_j = (_h = (_g = (_f = el === null || el === void 0 ? void 0 : el.lastElementChild) === null || _f === void 0 ? void 0 : _f.lastElementChild) === null || _g === void 0 ? void 0 : _g.firstElementChild) === null || _h === void 0 ? void 0 : _h.getAttribute('data-testid')) === null || _j === void 0 ? void 0 : _j.split('-')[1]) || '';
                return { storeName, address, storeCode };
            });
            // const cookies = await page.cookies();
            // await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));
        });
        res.status(200).send(response);
    }
    catch (err) {
        next(err);
    }
    finally {
        yield browser.close();
    }
});
exports.fetchStores = fetchStores;
const chooseStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let selectedStore = req.body;
    const browser = yield puppeteer_extra_1.default.launch({ headless: false });
    try {
        const page = yield browser.newPage();
        yield page.setViewport({ width: 1520, height: 800 });
        yield page.goto('https://www.ralphs.com/');
        yield page.type('.kds-Input[type="search"]', 'milk');
        yield page.keyboard.press('Enter');
        yield page.click('.CurrentModality-button');
        yield page.waitForSelector('.ReactModal__Content');
        const searchPostCodeButton = yield page.waitForSelector('.PostalCodeSearchBox--drawer');
        yield (searchPostCodeButton === null || searchPostCodeButton === void 0 ? void 0 : searchPostCodeButton.click());
        const input = yield page.waitForSelector('input[data-testid = PostalCodeSearchBox-input]');
        yield (input === null || input === void 0 ? void 0 : input.click({ clickCount: 3 }));
        yield (input === null || input === void 0 ? void 0 : input.type(selectedStore.index));
        yield page.click('.PostalCodeSearchBox-SolitarySearch >>> button');
        yield page.waitForSelector('button[data-testid = ModalityOption-Button-PICKUP]');
        yield page.click('button[data-testid = ModalityOption-Button-IN_STORE]');
        yield page.waitForSelector('.ModalitySelector--StoreSearchResults');
        const chooseStoreButton = yield page.waitForSelector(`button[data-testid = SelectStore-${selectedStore.storeCode}]`);
        yield (chooseStoreButton === null || chooseStoreButton === void 0 ? void 0 : chooseStoreButton.click());
        yield page.waitForTimeout(2000);
        const cookies = yield page.cookies();
        yield promises_1.default.writeFile('./cookies.json', JSON.stringify(cookies, null, 2)); // const cookiesString = await fs.readFile('./cookies.json');
        res.status(200).send({ 'message': 'Store selected' });
    }
    catch (err) {
        next(err);
    }
    finally {
        yield browser.close();
    }
});
exports.chooseStore = chooseStore;
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_extra_1.default.launch({ headless: false });
    try {
        const page = yield browser.newPage();
        yield page.setViewport({ width: 1520, height: 800 });
        yield page.goto('https://www.ralphs.com/');
        const cookiesString = promises_1.default.readFile('./cookies.json');
        // const cookies = JSON.parse(cookiesString);
        // await page.setCookie(...cookies);
        // res.send({message: cookies});
    }
    catch (err) {
        next(err);
    }
    finally {
        // await browser.close();
    }
});
exports.getProducts = getProducts;
