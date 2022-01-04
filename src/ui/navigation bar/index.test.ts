import puppeteer, {Browser, Page} from "puppeteer";
import {submitLoginForm} from "../../functionality/login/index.test";

describe("navigation bar ui test", () => {
    let browser: Browser
    let page: Page
    beforeAll(done => {
        (async () => {
            browser = await puppeteer.launch({headless: false})
            page = await browser.newPage()
            await page.goto(
                "http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login",
                {waitUntil: "domcontentloaded"}
            );
            await Promise.all([
                submitLoginForm(page, process.env.user!, process.env.password!),
                page.waitForNavigation({waitUntil: "networkidle0"})
            ])
            done()
        })()
    })

    it("should highlight selected tab", done => {
        (async () => {
            try {
                const navList = await page.$$eval(".main-menu-first-level-list-item .firstLevelMenu", els => {
                    return els.map((el) => {
                        return el.id
                    })
                })

                for (let i = 0; i < navList.length; i++) {
                    await Promise.all([
                        page.waitForNavigation({timeout: 5000}),
                        page.$eval(`#${navList[i]}`, el => {
                            const link = (<HTMLAnchorElement>el)
                            link.click()
                        })
                    ])
                    const bgColor = await page.$eval(`#${navList[i]}`,el=>{
                        const link = (<HTMLAnchorElement>el)
                        return window.getComputedStyle(el).backgroundColor
                    })
                    expect(bgColor).toEqual("rgb(242, 140, 56)")
                }
                await browser.close()
                done()
            } catch (error) {
                await page.screenshot({path: `${__dirname}/invalid-bg-color.png` })
                await browser.close()
                done(error)
            }
        })()
    })
})