const pupeeteer = require("puppeteer");

module.exports = {
  notLogined: async () => {
    const browser = await pupeeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      "http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/abc"
    );
    await page.screenshot({ path: `${__dirname}/abc.png` })
    await browser.close()
  },
};
