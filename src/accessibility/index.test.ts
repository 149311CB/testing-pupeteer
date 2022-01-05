import puppeteer, {Browser, Page} from "puppeteer";
import fs from "fs";

describe("login form accessibility", () => {
    let browser: Browser
    let page: Page
    beforeEach(done => {
        (async () => {
            browser = await puppeteer.launch({headless: true})
            page = await browser.newPage()
            await page.goto("http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login")
            done()
        })()
    })

    it("should have info about this", done => {
        (async () => {
            const button = await page.$("#btnLogin")
            if (!button) {
                done(new Error("missing button"))
            }
            const tree = await page.accessibility.snapshot()
            fs.writeFileSync(`${__dirname}/login-page-ax.json`, JSON.stringify(tree, null, 2))
            await browser.close()
            done()
        })()
    })
})