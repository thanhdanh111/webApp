let qs = require('qs');
let browser;
let page;
let token;
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
    const query = qs.parse(page.search);
    token = query.token;
    viewport = await page.setViewport({ width: 1853 , height: 951 });
  } catch (error) {
    console.log(error);
  }
});

describe('Pots Page', () => {
  if (!token) {
    test('Test login success', async () => {
      await page.goto('http://localhost:5000/login');
      await page.waitForSelector('.login-page');
    });

    return;
  }

  test('Test account page successfully', async () => {
    await page.click('http://localhost:5000/account');
    await page.waitForSelector('.home-page');
  });
});

afterAll(() => {
  browser.close();
});
