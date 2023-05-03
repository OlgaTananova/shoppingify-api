import puppeteer from "puppeteer-extra";
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import {Response, Request, NextFunction} from "express";
import fs from "fs/promises";

puppeteer.use(StealthPlugin());


async function selectStore(selectedStore: { index: string, storeCode: string }, res: Response) {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1520, height: 800});
    await page.goto('https://www.ralphs.com/');
    await page.type('.kds-Input[type="search"]', 'milk');
    await page.keyboard.press('Enter');
    await page.click('.CurrentModality-button');
    await page.waitForSelector('.ReactModal__Content');
    const searchPostCodeButton = await page.waitForSelector('.PostalCodeSearchBox--drawer');
    await searchPostCodeButton?.click();
    const input = await page.waitForSelector('input[data-testid = PostalCodeSearchBox-input]');
    await input?.click({clickCount: 3});
    await input?.type(selectedStore.index);
    await page.click('.PostalCodeSearchBox-SolitarySearch >>> button');
    await page.waitForSelector('button[data-testid = ModalityOption-Button-PICKUP]');
    await page.click('button[data-testid = ModalityOption-Button-IN_STORE]');
    await page.waitForSelector('.ModalitySelector--StoreSearchResults');
    const chooseStoreButton = await page.waitForSelector(`button[data-testid = SelectStore-${selectedStore.storeCode}]`);
    await chooseStoreButton?.click();
    await page.waitForTimeout(2000);
    const cookies = await page.cookies();
    await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));
    // const cookiesString = await fs.readFile('./cookies.json');
    // const cookies = JSON.parse(cookiesString);
    // await page.setCookie(...cookies);
    res.status(200).send({'message': 'Store selected'});
    await browser.close();
}

export const fetchStores = async (req: Request, res: Response, next: NextFunction) => {
    const {index} = req.body;
    const browser = await puppeteer.launch({headless: false});
    try {
        const page = await browser.newPage();
        await page.setViewport({width: 1520, height: 800});
        await page.goto('https://www.ralphs.com/');
        await page.type('.kds-Input[type="search"]', 'milk');
        await page.keyboard.press('Enter');
        await page.click('.CurrentModality-button');
        await page.waitForSelector('.ReactModal__Content');
        const searchPostCodeButton = await page.waitForSelector('.PostalCodeSearchBox--drawer');
        await searchPostCodeButton?.click();
        const input = await page.waitForSelector('input[data-testid = PostalCodeSearchBox-input]');
        await input?.click({clickCount: 3});
        await input?.type(index);
        await page.click('.PostalCodeSearchBox-SolitarySearch >>> button');
        await page.waitForSelector('button[data-testid = ModalityOption-Button-PICKUP]');
        await page.click('button[data-testid = ModalityOption-Button-IN_STORE]');
        await page.waitForSelector('.ModalitySelector--StoreSearchResults');
        const response = await page.$$eval('.ModalitySelector--StoreSearchResults .kds-Card', (elements) => {

            return elements.map((el) => {

                const storeName = el?.firstElementChild?.firstElementChild?.textContent || '';
                const address = el?.firstElementChild?.lastElementChild?.firstElementChild?.textContent || '';
                const storeCode = el?.lastElementChild?.lastElementChild?.firstElementChild?.getAttribute('data-testid')?.split('-')[1] || '';

                return {storeName, address, storeCode}
            });
            // const cookies = await page.cookies();
            // await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));
        })
        res.status(200).send(response);
    } catch (err) {
        next(err);
    } finally {
        await browser.close();
    }
}

export const chooseStore = async (req: Request, res: Response, next: NextFunction) => {
    let selectedStore = req.body;
    const browser = await puppeteer.launch({headless: false});
    try {
        const page = await browser.newPage();
        await page.setViewport({width: 1520, height: 800});
        await page.goto('https://www.ralphs.com/');
        await page.type('.kds-Input[type="search"]', 'milk');
        await page.keyboard.press('Enter');
        await page.click('.CurrentModality-button');
        await page.waitForSelector('.ReactModal__Content');
        const searchPostCodeButton = await page.waitForSelector('.PostalCodeSearchBox--drawer');
        await searchPostCodeButton?.click();
        const input = await page.waitForSelector('input[data-testid = PostalCodeSearchBox-input]');
        await input?.click({clickCount: 3});
        await input?.type(selectedStore.index);
        await page.click('.PostalCodeSearchBox-SolitarySearch >>> button');
        await page.waitForSelector('button[data-testid = ModalityOption-Button-PICKUP]');
        await page.click('button[data-testid = ModalityOption-Button-IN_STORE]');
        await page.waitForSelector('.ModalitySelector--StoreSearchResults');
        const chooseStoreButton = await page.waitForSelector(`button[data-testid = SelectStore-${selectedStore.storeCode}]`);
        await chooseStoreButton?.click();
        await page.waitForTimeout(2000);
        const cookies = await page.cookies();
        await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2));// const cookiesString = await fs.readFile('./cookies.json');
        res.status(200).send({'message': 'Store selected'});
    } catch (err) {
        next(err);
    } finally {
        await browser.close();
    }
}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    const browser = await puppeteer.launch({headless: false});
    try {
        const page = await browser.newPage();
        await page.setViewport({width: 1520, height: 800});
        await page.goto('https://www.ralphs.com/');
        const cookiesString = fs.readFile('./cookies.json');
        // const cookies = JSON.parse(cookiesString);
        // await page.setCookie(...cookies);
        // res.send({message: cookies});
    } catch (err) {
        next(err);
    } finally {
        // await browser.close();
    }
}
