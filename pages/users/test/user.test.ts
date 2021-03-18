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
    viewport = await page.setViewport({ width: 1920 , height: 835 });
  } catch (error) {
    console.log(error);
  }
});

describe('Users Page', () => {
  test('Test UI list users page success', async () => {
    await page.goto('http://localhost:5000/users');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });

});

afterAll(() => {
  browser.close();
});
