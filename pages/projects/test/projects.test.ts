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

    await page.goto('http://localhost:5000');

    await page.evaluate((token) => {
      localStorage.setItem('access_token', token);
    });

  } catch (error) {
    console.log(error);
  }
});

describe('Projects page', () => {
  test('Test projects page successfully', async () => {
    await page.goto('http://localhost:5000/projects');
    await page.waitForSelector('.projects');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });

});

afterAll(() => {
  browser.close();
});
