import dotenv from "dotenv";
import puppeteer, {HTTPResponse, Page} from "puppeteer";

dotenv.config()

describe("test login functionality", () => {
    let page: puppeteer.Page
    let browser: puppeteer.Browser
    beforeAll(async () => {
        jest.setTimeout(180000)
        browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
        await page.goto(
            "http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login",
            {waitUntil: 'networkidle2'}
        );
    })

    test("valid credential", done => {
        (async () => {
            await submitLoginForm(page, process.env.user!, process.env.password!)
            const response = await page.waitForNavigation({timeout: 5000})
            expect(response?.status()).toEqual(200)
            expect(response?.url()).toEqual("http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/dashboard")
            const {cookies} = await page.client().send("Network.getAllCookies")
            expect(cookies.find(cookie => cookie.name === "PHPSESSID")?.value).toBeTruthy()
            await browser.close()
            done()
        })()
    })

    test("invalid credential", done => {
        (async () => {
            try {
                await submitLoginForm(page, "admin", "123456")
            } catch (error) {
                expect(await page.$eval("#spanMessage", el => {
                    return el.textContent
                })).toEqual("Invalid credentials")
            }
            await browser.close()
            done()
        })()
    })
})

export const submitLoginForm = async (page: Page, username: string, password: string) => {
    await page.$eval('input[type=text]#txtUsername', (el, username) => {
        const input = (<HTMLInputElement>el)
        input.value = username as string
    }, username)

    await page.$eval("input[type=password]#txtPassword", (el, password) => {
        const input = (<HTMLInputElement>el)
        input.value = password as string
    }, password)

    await page.$eval("input[type=submit]#btnLogin", (el) => {
        const input = (<HTMLInputElement>el)
        input.click()
    })
}

