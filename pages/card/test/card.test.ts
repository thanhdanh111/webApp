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

describe('Card Page', () => {
  test('Test UI list card page successfully after login', async () => {
    await page.goto('http://localhost:5000/board');
    await page.waitFor(5000);
    await page.waitForSelector('.flowchart');
    await page.waitFor(5000);

    await page.waitForSelector('.list-board');


    const imageListBoard = await page.screenshot();
    expect(imageListBoard).toMatchImageSnapshot();

    await page.click('.create-name-flowchart');

    await page.waitForSelector('.back-ground');
    await page.waitFor(5000);
    await page.click('.div-svg-process');

    const viewBoard = await page.screenshot();
    expect(viewBoard).toMatchImageSnapshot();

  });

});

afterAll(() => {
  browser.close();
});
