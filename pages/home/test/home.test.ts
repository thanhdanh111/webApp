let qs = require('qs');
let browser;
let page;
let viewport;

const puppeteer = require('puppeteer');

const token = process.env.TEST_TOKEN;

beforeAll(async () => {
  try {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 0,
      ignoreDefaultArgs: ['--no-sandbox'],
    });

    page = await browser.newPage();

    viewport = await page.setViewport({ width: 1366 , height: 913 });
    
    await page.goto('http://localhost:5000');

    await page.evaluate((token) => {
      localStorage.setItem('access_token', token);
    });

  } catch (error) {
    console.log(error);
  }
});

describe('Home Page', () => {
  test('Test ui page home success after login', async () => {
    await page.goto('http://localhost:5000/home');
    await page.waitForSelector('.test-home');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });

});

afterAll(() => {
  browser.close();
});
