import puppeteer, {Browser, Page} from "puppeteer";
import {submitLoginForm} from "../../../login/index.test";
import {goToPersonalDetails} from "../index";


describe("test form requirements fields", () => {
    let page: Page
    let browser: Browser
    beforeEach(done => {
        const __ret = goToPersonalDetails(browser, page, done);
        browser = __ret.browser;
        page = __ret.page;
    })

    test("using js", done => {
        (async () => {
            try {
                await page.$eval("input[type=button]#btnSave", (el) => {
                    const input = (<HTMLInputElement>el)
                    input.click()
                })
                const list = await page.$$("#frmEmpPersonalDetails li")
                for (let i = 0; i < list.length; i++) {
                    const em = await list[i].$("em")
                    if (em) {
                        const content = await em.getProperty("textContent")
                        if (content._remoteObject.value === "*") {
                            const input = await list[i].$eval("input[type=text]", (el) => {
                                const input = (<HTMLInputElement>el)
                                input.value = ""
                                return input
                            })
                            if (input) {
                                const errorMessage = await list[i].$eval("span.validation-error", (el) => el.textContent)
                                expect(errorMessage).toEqual("Required")
                            }
                        }
                    }
                }
                await browser.close()
                done()
            } catch (error) {
                await browser.close()
                done(error)
            }
        })()
    })

    test("simulate keyboard event", done => {
        (async () => {
            try {
                await page.$eval("input[type=button]#btnSave", (el) => {
                    const input = (<HTMLInputElement>el)
                    input.click()
                })
                const list = await page.$$("#frmEmpPersonalDetails li")
                for (let i = 0; i < list.length; i++) {
                    const em = await list[i].$("em")
                    if (em) {
                        const content = await em.getProperty("textContent")
                        if (content._remoteObject.value === "*") {
                            const input = await list[i].$("input[type=text]")
                            if (input) {
                                await input?.focus()
                                await page.keyboard.down("ControlRight")
                                    .then(async () => await page.keyboard.press("A"))
                                    .then(async () => await page.keyboard.press("Backspace"))
                                const errorMessage = await list[i].$eval("span.validation-error", (el) => el.textContent)
                                expect(errorMessage).toEqual("Required")
                            }
                        }
                    }
                }
                await browser.close()
                done()
            } catch (error) {
                await browser.close()
                done(error)
            }
        })()
    })
})