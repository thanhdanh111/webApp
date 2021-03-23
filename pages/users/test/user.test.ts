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
    viewport = await page.setViewport({ width: 1920 , height: 835 });
  } catch (error) {
    console.log(error);
  }
});

describe('Users Page', () => {
  if (!token) {
    test('Test login success', async () => {
      await page.goto('http://localhost:5000/login');
      await page.waitForSelector('.login-page');
    });

    return;
  }

  test('Test UI list users page success', async () => {
    await page.goto('http://localhost:5000/users');
    await page.waitForSelector('.users');
  });

});

afterAll(() => {
  browser.close();
});
