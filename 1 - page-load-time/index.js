const pupeeteer = require("puppeteer");
const fs = require("fs");

module.exports = (async () => {
  const browser = await pupeeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "http://localhost/orangehrm-4.5/orangehrm-4.5/symfony/web/index.php/auth/login"
  );
  const gitMetrics = await page.metrics();
  console.log(gitMetrics.Timestamp);
  console.log(gitMetrics.TaskDuration);
  const file = `${__dirname}/history.json`
  var data = fs.readFileSync(file).toString().split("\n");
  data.splice(data.length - 2, 0, `,\n{"timestamp":${gitMetrics.Timestamp}, "taskDuration":${gitMetrics.TaskDuration}}`);
  fs.writeFile(file, data.join("\n"),err=>{
    if(err){
      console.log(err)
      return
    }
  })
  await browser.close();
});
