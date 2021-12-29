const pupeeteer = require("puppeteer");
const loginForm = require("../3 - login form");

module.exports = async () => {
  // console.log(username)
  // console.log(password)
  const result = await loginForm();
  if (!result) {
    console.log("previous test faile: 3 - login form");
  }
  const browser = await pupeeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    "http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login"
  );
  await page.$eval(
    "#txtUsername",
    (el, username) => {
      el.value = username;
    },
    (username = process.env.user)
  );
  await page.$eval(
    "#txtPassword",
    (el, password) => {
      el.value = password;
    },
    (password = process.env.password)
  );
  await page.evaluate(() => {
    document.querySelector("input[type=submit]#btnLogin").click();
  });
  await page.waitForNavigation({ waitUntil: "networkidle0" });
  await page.screenshot({ path: `${__dirname}/redirected.png` });
  await browser.close();
};
