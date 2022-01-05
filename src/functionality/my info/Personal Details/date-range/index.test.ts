import puppeteer, {Browser, Page} from "puppeteer";
import {submitLoginForm} from "../../../login/index.test";
import {goToPersonalDetails} from "../index";

describe("test limited date range", () => {
    let browser: Browser
    let page: Page
    beforeEach(done => {
        const __ret = goToPersonalDetails(browser, page, done);
        browser = __ret.browser;
        page = __ret.page;
    })

    test("birthday", done => {
        (async () => {
            try {
                await page.$eval("input[type=button]#btnSave", (el) => {
                    const input = (<HTMLInputElement>el)
                    input.click()
                })
                await page.$eval("#personal_DOB", el => {
                    const input = (<HTMLInputElement>el)
                    input.value = "2042-01-01"
                })
                await Promise.all([
                    page.$eval("input[type=button]#btnSave", (el) => {
                        const input = (<HTMLInputElement>el)
                        input.click()
                    }),
                    page.waitForNavigation({waitUntil: "networkidle0"})
                ])

                expect(await page.$(".message.success")).toBeFalsy()

                await browser.close()
                done()
            } catch (error) {
                await browser.close()
                done(error)
            }
        })()
    })
})