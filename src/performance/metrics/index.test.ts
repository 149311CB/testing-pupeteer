import puppeteer, {Browser, Metrics, Page} from "puppeteer";
import {NETWORK_PRESETS, networkPresets} from "../page-load-time/network-throttling/index.test";
import fs from "fs";

describe("get login page metrics", () => {
    let browser: Browser;
    let page: Page
    beforeEach(done => {
        (async () => {
            browser = await puppeteer.launch({headless: false})
            page = await browser.newPage()
            done()
        })()
    })

    test("on wifi", done => {
        (async () => {
            try {
                await networkThrottling(page, "WiFi")
                await page.goto("http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login")
                const metrics = await page.metrics()
                writeToFile("WiFi", metrics)
                await browser.close()
                done()
            } catch (error) {
                await browser.close()
                done(error)
            }
        })()
    })

    test("on regular 4G", done => {
        (async () => {
            try {
                await networkThrottling(page, "Regular4G")
                await page.goto("http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login")
                const metrics = await page.metrics()
                writeToFile("Regular4G", metrics)
                await browser.close()
                done()
            } catch (error) {
                await browser.close()
                done(error)
            }
        })()
    })

    // test("on regular 3G", done => {
    //     (async () => {
    //         try {
    //             await networkThrottling(page, "Regular3G")
    //             await page.goto("http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login")
    //             const metrics = await page.metrics()
    //             writeToFile("Regular3G", metrics)
    //             await browser.close()
    //             done()
    //         } catch (error) {
    //             await browser.close()
    //             done(error)
    //         }
    //     })()
    // })
})

const networkThrottling = async (page: Page, networkType: networkPresets) => {
    const client = await page.target().createCDPSession()
    await client.send("Network.emulateNetworkConditions", NETWORK_PRESETS[networkType])
}

const writeToFile = (networkType: networkPresets, metrics: Metrics) => {
    const file = `${__dirname}/metrics.json`
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, `[
                {"networkType":"${networkType}", "metrics":${JSON.stringify(metrics)}}
            ]`)
    } else {
        const data = fs.readFileSync(file).toString().split("\n");
        data.splice(
            data.length - 1,
            0,
            `,\n{"networkType":"${networkType}", "metrics":${JSON.stringify(metrics)}}`
        );
        fs.writeFileSync(file, data.join("\n"))
    }
}