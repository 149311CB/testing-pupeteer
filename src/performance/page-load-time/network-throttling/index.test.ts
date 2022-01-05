import puppeteer, {Page} from "puppeteer";
import fs from "fs";


function writeMetricsToFile(timestamp: number, duration: number) {
    const file = `${__dirname}/history.json`;
    let data = null;
    if (fs.existsSync(file)) {
        data = fs.readFileSync(file).toString().split("\n");
        data.splice(
            data.length - 1,
            0,
            `,\n{"timestamp":"${new Date(timestamp).toLocaleString()}", "totalDuration":${duration}}`
        );
        data = data.join("\n");
    } else {
        data = `[{"timestamp": "${new Date(timestamp).toLocaleString()}",
                    "taskDuration": ${duration}}
                    ]`
    }
    fs.writeFileSync(file, data);
    return
}

async function getLoadTime(networkType: networkPresets, page: Page) {
    const client = await page.target().createCDPSession()
    await client.send("Network.emulateNetworkConditions", NETWORK_PRESETS[networkType])
    await page.goto(
        "http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login",
        {waitUntil: "domcontentloaded"}
    );

    const performance = JSON.parse(await page.evaluate(() => JSON.stringify(window.performance.toJSON(), null, 2)))
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart

    return {performance, loadTime};
}

describe("Test total time for page to load for the first visit", () => {
    let page: puppeteer.Page
    let browser: puppeteer.Browser
    beforeEach(done => {
        (async () => {
            browser = await puppeteer.launch({headless: false});
            page = await browser.newPage();
            done()
        })()
    })

    test("on wifi", done => {
        (async () => {
            try {
                const {performance, loadTime} = await getLoadTime("WiFi", page);
                writeMetricsToFile(performance.timeOrigin, loadTime);
                expect(loadTime).toBeLessThanOrEqual(2000);
                await browser.close();
                done()
            } catch (error) {
                await browser.close()
                done()
            }
        })()
    })

    test("on regular 4G", done => {
            (async () => {
                try {
                    const {performance, loadTime} = await getLoadTime("Regular4G", page);
                    writeMetricsToFile(performance.timeOrigin, loadTime);
                    expect(loadTime).toBeLessThanOrEqual(5000);
                    await browser.close();
                    done()
                } catch (error) {
                    await browser.close();
                    done()
                }
            })()
        }
    )

    test("on regular 3G", done => {
        (async () => {
            try {
                const {performance, loadTime} = await getLoadTime("Regular3G", page);
                writeMetricsToFile(performance.timeOrigin, loadTime);
                expect(loadTime).toBeLessThanOrEqual(15000);
                await browser.close();
                done()
            } catch (error) {
                await browser.close()
                done(error)
            }
        })()
    })
})

export const NETWORK_PRESETS = {
    'GPRS': {
        'offline': false,
        'downloadThroughput': 50 * 1024 / 8,
        'uploadThroughput': 20 * 1024 / 8,
        'latency': 500
    },
    'Regular2G': {
        'offline': false,
        'downloadThroughput': 250 * 1024 / 8,
        'uploadThroughput': 50 * 1024 / 8,
        'latency': 300
    },
    'Good2G': {
        'offline': false,
        'downloadThroughput': 450 * 1024 / 8,
        'uploadThroughput': 150 * 1024 / 8,
        'latency': 150
    },
    'Regular3G': {
        'offline': false,
        'downloadThroughput': 750 * 1024 / 8,
        'uploadThroughput': 250 * 1024 / 8,
        'latency': 100
    },
    'Good3G': {
        'offline': false,
        'downloadThroughput': 1.5 * 1024 * 1024 / 8,
        'uploadThroughput': 750 * 1024 / 8,
        'latency': 40
    },
    'Regular4G': {
        'offline': false,
        'downloadThroughput': 4 * 1024 * 1024 / 8,
        'uploadThroughput': 3 * 1024 * 1024 / 8,
        'latency': 20
    },
    'DSL': {
        'offline': false,
        'downloadThroughput': 2 * 1024 * 1024 / 8,
        'uploadThroughput': 1 * 1024 * 1024 / 8,
        'latency': 5
    },
    'WiFi': {
        'offline': false,
        'downloadThroughput': 30 * 1024 * 1024 / 8,
        'uploadThroughput': 15 * 1024 * 1024 / 8,
        'latency': 2
    }
}

export type networkPresets = keyof typeof NETWORK_PRESETS