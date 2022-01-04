import puppeteer, {Browser, Page} from "puppeteer";
import {submitLoginForm} from "../../login/index.test";

export function goToPersonalDetails(browser: Browser, page: Page, done: jest.DoneCallback) {
    (async () => {
        try {

            browser = await puppeteer.launch({headless: false, product: "firefox"})
            page = await browser.newPage()
            await page.goto(
                "http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login",
                {waitUntil: 'networkidle2'}
            );
            await Promise.all([
                submitLoginForm(page, process.env.user!, process.env.password!),
                page.waitForNavigation({waitUntil: "domcontentloaded"})
            ])
            await page.goto("http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/pim/viewMyDetails")
            done()
        } catch (error) {
            done(error)
        }
    })()
    return {browser, page};
}
