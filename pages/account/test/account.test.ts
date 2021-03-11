let browser;
let page;
// let token;
let viewport;

const puppeteer = require('puppeteer');
beforeAll(async () => {
  try {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 0,
      ignoreDefaultArgs: ['--no-sandbox'],
    });

    page = await browser.newPage();
    viewport = await page.setViewport({ width: 1853 , height: 951 });
  } catch (error) {
    console.log(error);
  }
});

describe('Pots Page', () => {
  test('Test account page successfully', async () => {
    await page.goto('http://localhost:5000/account');
    await page.waitForSelector('.account-page');

    const image = await page.screenshot();
  });

});

afterAll(() => {
  browser.close();
});
