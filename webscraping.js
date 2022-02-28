//including puppeteer tool
const puppeteer = require('puppeteer');
const mailer = require('./mailer');

// User credentails
const cred = [{ uname: "BH5377@csvtu.ac.in", pass: "Nikhil@akhil123", email: "abhiabhishek16.2001@gmail.com" }
]

var screenShotAndMail = async (cred) => new Promise(async (resolve, reject) => {
  
  const browser = await puppeteer.launch({
    headless: true
  })

  const page = await browser.newPage();
  await page.goto('https://www.tcsion.com/SelfServices/');
  await page.waitForNetworkIdle()
  await page.setViewport({ width: 1536, height: 768 });

  /**
   * Login 
   * 
   */
  await page.type('#accountname', `${cred.uname}`);
  await page.type('#password', `${cred.pass}`);
  await page.click("#content-login > div.action-container > div > div > button");
  await page.waitForTimeout(20000);
  await page.waitForNetworkIdle("windows.ready");


  await page.click("#UIrightContainerNavDiv1 > div > div > div > div > div:nth-child(2) > div:nth-child(2) > div");
  await Promise.all([
    await page.waitForNetworkIdle(),
  ]);
  await page.waitForSelector("#quickLinkFrame > iframe");
  const frameHandle = await page.$("#quickLinkFrame > iframe");
  const frame = await frameHandle.contentFrame();
  await frame.waitForSelector("#myTable");

  const url = await frame.evaluate(async () => {
    var hrefs = document.querySelectorAll("#myTable > tbody > tr > td > a")
    var links = [];
    hrefs.forEach(element => {
      links.push(element.href);
    });
    return Promise.resolve(links);
  });

  const results = [];
  const takeScreenshot = async () => new Promise(async (resolve, reject) => {
    for (let i = 0; i < url.length; i++) {
      let path = url[i];
      const pagex = await browser.newPage();
      await pagex.setViewport({ width: 1536, height: 968, deviceScaleFactor: 0.7 });
      await pagex.goto(path);

      await pagex.waitForTimeout(4000);
      await page.waitForNetworkIdle("windows.ready");
      const name = `example${Date.now()}.png`;
      results.push(name);
  
      await pagex.screenshot({
        path: name,
        clip: {
          x: 320,
          y: 76,
          width: 1200,
          height: 800
        }
      
      });
      await pagex.waitForTimeout(1000);
      await pagex.close();
      if( i >= url.length-1){
        resolve();
      }
    }
  });

  await takeScreenshot();
  
  await browser.close();
  const attachments = results.map(res => {
    return {
      filename: res,
      path: `./${res}`
    }
  })

  /**
   * Sending email here
   * to: Email id you want to send email
   * subject: subject of email
   * 
   */
  await mailer.sendMail(cred.email, "csvtu_result", " All 4 sem result ", attachments);
  resolve();
});

(async () => {
  for (let i in cred) {
    await screenShotAndMail(cred[i]);
  };
})();






