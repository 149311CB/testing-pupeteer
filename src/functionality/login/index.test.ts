import dotenv from "dotenv";
import puppeteer, {Page} from "puppeteer";

dotenv.config()

describe("login functionality", () => {
    let page: puppeteer.Page
    let browser: puppeteer.Browser
    beforeEach(async () => {
        jest.setTimeout(180000)
        browser = await puppeteer.launch({
            headless: false,
            product: 'chrome'
        })
        page = await browser.newPage()
        await page.goto(
            "http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login",
            {waitUntil: 'networkidle2'}
        );
    })

    test("valid credential", done => {
        (async () => {
            try {
                const [response] = await Promise.all([
                    page.waitForNavigation(),
                    submitLoginForm(page, process.env.user!, process.env.password!),
                ])
                await page.screenshot({path: `${__dirname}/redirected.png`});
                expect(response?.status()).toEqual(200)
                expect(response?.url()).toEqual("http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/dashboard")
                const {cookies} = await page.client().send("Network.getAllCookies")
                expect(cookies.find(cookie => cookie.name === "PHPSESSID")?.value).toBeTruthy()
                await browser.close()
                done()
            } catch (error) {
                await browser.close()
                done(error)
            }
        })()
    })

    test("invalid credential", done => {
        (async () => {
            try {
                await submitLoginForm(page, "admin", "123456")
            } catch (error) {
                await page.screenshot({path: `${__dirname}/not-redirected.png`});
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
    const usernameSelector = 'input[type=text]#txtUsername'
    const passwordSelector = 'input[type=password]#txtPassword'
    const submitSelector = 'input[type=submit]#btnLogin'
    await page.click(usernameSelector)
    await page.type(usernameSelector, username, {delay: 100})
    await page.click(passwordSelector)
    await page.type(passwordSelector, password, {delay: 100})
    await page.click(submitSelector)
}

