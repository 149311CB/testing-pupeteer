import puppeteer from "puppeteer";
import dotenv from "dotenv";
import {submitLoginForm} from "../../functionality/4 - test login/index.test";

dotenv.config()

describe("Test what will happen with invalid url", () => {
    let page: puppeteer.Page
    let browser: puppeteer.Browser
    let response: puppeteer.HTTPResponse
    beforeAll(async () => {
        browser = await puppeteer.launch({headless: false});
        page = await browser.newPage();
        response = await page.goto(
            "http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/abc"
        );
    })

    test("when not log in", done => {
        (async () => {
            try {
                await page.screenshot({path: `${__dirname}/when-not-login.png`})
                expect(response.status()).toEqual(404)
                expect(await page.$eval('.message.warning', el => el.textContent)
                    .then((result) => result?.trim()))
                    .toEqual("Invalid Request")
                await browser.close()
                done()
            } catch (error) {
                await browser.close()
                done(error)
            }
        })()
    })

    test("when logged in", done => {
        (async () => {
            try {
                await Promise.all([
                    submitLoginForm(page, process.env.user!, process.env.password!),
                    page.waitForNavigation({timeout: 5000})
                ])
                const newResponse = await page.goto(
                    "http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/abc"
                );

                expect(newResponse.status()).toEqual(404)
                expect(await page.$eval('.message.warning', el => el.textContent)
                    .then((result) => result?.trim()))
                    .toEqual("Invalid Request")

                await page.screenshot({path: `${__dirname}/when-logged-in.png`})
                await browser.close()
                done()
            } catch (error) {
                await browser.close()
                done(error)
            }
        })()
    })
})
