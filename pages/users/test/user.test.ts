let qs = require('qs');
let browser;
let page;
let viewport;
const token = process.env.TEST_TOKEN;

const puppeteer = require('puppeteer');
beforeAll(async () => {
  try {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 0,
      ignoreDefaultArgs: ['--no-sandbox'],
    });

    page = await browser.newPage();

    viewport = await page.setViewport({ width: 1920 , height: 835 });

    await page.goto('http://localhost:5000/');

    await page.evaluate((token) => {
      localStorage.setItem('access_token', token);
    }, token);

  } catch (error) {
    console.log(error);
  }
});

describe('Users Page', () => {

  test('Test UI list users page successfully after login', async () => {
    await page.goto('http://localhost:5000/users');
    await page.waitFor(50000);
    await page.waitForSelector('.users');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();

    await page.waitForSelector('.table-body');
    await page.waitForSelector('.checkbox-cell');
    await page.waitForSelector('.btn-expanded');
    await page.click('.btn-expanded');
    await page.waitFor(5000);

    const expanded = await page.screenshot();
    expect(expanded).toMatchImageSnapshot();
  });

});

afterAll(() => {
  browser.close();
});
