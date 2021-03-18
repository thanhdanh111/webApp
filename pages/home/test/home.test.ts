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
    viewport = await page.setViewport({ width: 1366 , height: 913 });
  } catch (error) {
    console.log(error);
  }
});

describe('Pots Page', () => {
  test('Test delete posts succes', async () => {
    await page.goto('http://localhost:5000/home');
    await page.waitForSelector('.hero-content');

    const image = await page.screenshot();
  });

});

afterAll(() => {
  browser.close();
});
