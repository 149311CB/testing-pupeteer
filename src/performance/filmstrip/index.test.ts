import puppeteer, {Browser, Page} from "puppeteer";
import fs from "fs";
import {submitLoginForm} from "../../functionality/login/index.test";

describe("extract filmstrip screenshot", () => {
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
                await Promise.all([
                    page.goto(
                        "http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login",
                    ),
                    page.waitForNavigation({timeout: 20000})
                ])
                await page.tracing.stop()

                const tracing = JSON.parse(fs.readFileSync(`${__dirname}/trace.json`, 'utf8'));
                const traceScreenshots = tracing.traceEvents.filter((x: any) => (
                    x.cat === 'disabled-by-default-devtools.screenshot' &&
                    x.name === 'Screenshot' &&
                    typeof x.args !== 'undefined' &&
                    typeof x.args.snapshot !== 'undefined'
                ));

                traceScreenshots.forEach(function (snap: any, index: any) {
                    fs.writeFile(`${__dirname}/trace-screenshot-${index}.png`, snap.args.snapshot, 'base64', function (err) {
                        if (err) {
                            console.log('writeFile error', err);
                        }
                    });
                });
                await browser.close()
                done()
            } catch (error) {
                await browser.close()
                done(error)
            }
        })()
    })
})