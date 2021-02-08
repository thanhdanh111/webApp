
let browser;
let page;
let token;
let viewport;

const puppeteer = require('puppeteer');
beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
  });

  page = await browser.newPage();
  viewport = await page.setViewport({ width: 1366 , height: 913 });

});

describe('Pots Page', () => {
  test('Test delete posts succes', async () => {
    await page.goto('https://google.com');
    await page.waitForSelector('#hplogo');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  });

});

afterAll(() => {
  browser.close();
});
