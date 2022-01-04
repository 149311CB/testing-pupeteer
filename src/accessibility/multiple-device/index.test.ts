import puppeteer, {Browser, Page} from "puppeteer";
import {submitLoginForm} from "../../functionality/login/index.test";

describe("test page on multiple device", () => {
    let browser: Browser
    let page: Page
    beforeEach(done => {
        (async () => {
            browser = await puppeteer.launch({headless: false})
            page = await browser.newPage()
            done()
        })()
    })

    test("Desktop View", done => {
        (async () => {
            await page.goto("http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login")
            await page.setViewport({width: 1650, height: 1050})
            await Promise.all([
                submitLoginForm(page, process.env.user!, process.env.password!),
                page.waitForNavigation({timeout: 5000})
            ])
            await page.screenshot({path: `${__dirname}/desktop-view.png`})
            done()
        })()
    })

    test("mobile view", done => {
        (async () => {
            const mobile = puppeteer.devices['iPhone X'];
            await page.goto("http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login")
            await page.emulate(mobile)
            await Promise.all([
                submitLoginForm(page, process.env.user!, process.env.password!),
                page.waitForNavigation({timeout: 5000})
            ])
            await page.screenshot({path: `${__dirname}/mobile-iphone-X.png`})
            done()
        })()
    })

})