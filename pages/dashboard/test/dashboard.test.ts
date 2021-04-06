let qs = require('qs');
let browser;
let page;
let viewport;

const puppeteer = require('puppeteer');
const waitOptions = { timeout: 10 * 1000 };

const token = process.env.TEST_TOKEN;

beforeAll(async () => {

  try {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 0,
      ignoreDefaultArgs: ['--no-sandbox'],
    });

    page = await browser.newPage();

    viewport = await page.setViewport({ width: 1853 , height: 951 });

    await page.goto('http://localhost:5000');

    await page.evaluate((token) => {
      localStorage.setItem('access_token', token);
    });

  } catch (error) {
    console.log(error);
  }
});

describe('DashBoard page', () => {
  test('Test dashboard successfully after login', async () => {
    await page.goto('http://localhost:5000/dashboard');
    await page.waitForSelector('.dashboard-page');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  }, 90000000);

});

afterAll(() => {
  browser.close();
});
