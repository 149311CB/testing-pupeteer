import puppeteer, {Page, Browser} from "puppeteer";

describe("Check if login form exist and have valid input", () => {
    let page: Page
    let browser: Browser
    beforeAll(async () => {
        jest.setTimeout(20000)
        browser = await puppeteer.launch()
        page = await browser.newPage()
        await page.goto(
            "http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login"
        );
        await page.screenshot({path: `${__dirname}/form.png`});
    })

    test("form", done => {
        testForm(page, done);
    })

    test("username", done => {
        testUsernameTextField(page, done);
    })

    test("password", done => {
        testPasswordTextField(page, done);
    })

    test("submit", done => {
        testSubmitButton(page, done);
    })

    afterAll(done => {
            (async () => {
                await browser.close()
                done()
            })()
        }
    )
})

function testForm(page: Page, done: jest.DoneCallback) {
    (async () => {
        const form = await page.$("#frmLogin");
        expect(form).toBeTruthy()
        if (form) {
            expect(await page.$eval("#frmLogin", el => el.tagName)).toEqual("FORM")
        }
        done()
    })()
}

function testUsernameTextField(page: Page, done: jest.DoneCallback) {
    (async () => {
        const input = await page.$("#txtUsername");
        expect(input).toBeTruthy()
        if (input) {
            expect(await page.$eval("#txtUsername", el => el.tagName))
                .toEqual("INPUT")
            expect(await page.$eval("#txtUsername", el => el.getAttribute("type")))
                .toEqual("text")
        }
        done()
    })()
}

function testPasswordTextField(page: Page, done: jest.DoneCallback) {
    (async () => {
        const selector = "#txtPassword"
        const input = await page.$(selector);
        expect(input).toBeTruthy()
        if (input) {
            expect(await page.$eval(selector, el => el.tagName))
                .toEqual("INPUT")
            expect(await page.$eval(selector, el => el.getAttribute("type")))
                .toEqual("password")
        }
        done()
    })()
}

function testSubmitButton(page: Page, done: jest.DoneCallback) {
    (async () => {
        const selector = "#btnLogin"
        const input = await page.$(selector);
        expect(input).toBeTruthy()
        if (input) {
            expect(await page.$eval(selector, el => el.tagName))
                .toEqual("INPUT")
            expect(await page.$eval(selector, el => el.getAttribute("type")))
                .toEqual("submit")
        }
        done()
    })()
}