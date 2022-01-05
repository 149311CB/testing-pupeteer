import puppeteer, {Browser, Page} from "puppeteer";
import fs from "fs";
import {submitLoginForm} from "../../functionality/login/index.test";

describe("get tracing", () => {
    let browser: Browser
    let page: Page
    beforeAll(done => {
        (async () => {
            browser = await puppeteer.launch({headless: false, product: "chrome"})
            page = await browser.newPage()
            done()
        })()
    })

    test("no condition", done => {
        (async () => {
            try {
                await page.tracing.start({screenshots: true, path: `${__dirname}/trace.json`})
                await page.goto(
                    "http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login",
                )
                await Promise.all([
                    page.waitForNavigation(),
                    submitLoginForm(page, process.env.user!, process.env.password!)
                ])
                await page.tracing.stop()
                await browser.close()
                done()
            } catch (error) {
                await browser.close()
                done(error)
            }
        })()
    })
})