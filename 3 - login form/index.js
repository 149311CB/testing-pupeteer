const pupeeteer = require("puppeteer");

module.exports = (async () => {
  const browser = await pupeeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login"
  );
  const form = await page.evaluate(() => {
    return document.querySelector("#frmLogin");
  });
  const username = await page.evaluate(() => {
    return document.querySelector("#txtUsername");
  });
  const password = await page.evaluate(() => {
    return document.querySelector("#txtPassword");
  });
  const submit = await page.evaluate(() => {
    return document.querySelector("#btnLogin");
  });
  if (!form) {
    console.log("login form is missing");
    await page.screenshot({ path: `${__dirname}/missing-form.png` });
    await browser.close();
    return false;
  } else if (!username || !password || !submit) {
    console.log("input is missing");
    const element = await page.$("#frmLogin");
    await element.screenshot({ path: `${__dirname}/form.png` });
    await browser.close();
    return false;
  }
  console.log("no issue found");

  const element = await page.$("#frmLogin");
  await element.screenshot({ path: `${__dirname}/form.png` });
  await browser.close();
  return true;
});
