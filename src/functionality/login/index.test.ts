import dotenv from "dotenv";
import puppeteer, {HTTPResponse, Page} from "puppeteer";

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
                let response: HTTPResponse | null = null
                await Promise.all([
                    submitLoginForm(page, process.env.user!, process.env.password!),
                    page.waitForNavigation().then(result => response = result)
                ])
                if (response) {
                    await page.screenshot({path: `${__dirname}/redirected.png`});
                    // @ts-ignore
                    expect(response.status()).toEqual(200)
                    // @ts-ignore
                    expect(response.url()).toEqual("http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/dashboard")
                    const {cookies} = await page.client().send("Network.getAllCookies")
                    expect(cookies.find(cookie => cookie.name === "PHPSESSID")?.value).toBeTruthy()
                    await browser.close()
                    done()
                } else {
                    await browser.close()
                    done(new Error("response is undefined"))
                }
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

