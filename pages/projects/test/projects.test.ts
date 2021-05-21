let browser;
let page;
// let token;
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

    viewport = await page.setViewport({ width: 1853 , height: 951 });

    await page.goto('http://localhost:5000');

    await page.evaluate((token) => {
      localStorage.setItem('access_token', token);
    }, token);

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

    await page.waitForSelector('.btn-primary');
    await page.click('.btn-primary');

    await page.waitForSelector('.text-create-projects');

    const createLinksTab = await page.screenshot();
    expect(createLinksTab).toMatchImageSnapshot();

  });

  test('Test projects page successfully', async () => {
    await page.goto('http://localhost:5000/projects');
    await page.waitForSelector('.projects');

    await page.waitForSelector('.text-nodejs');

    const grid = await page.screenshot();
    expect(grid).toMatchImageSnapshot();

  });

  test('Test projects page successfully', async () => {
    await page.goto('http://localhost:5000/projects');
    await page.waitForSelector('.projects');

    await page.waitForSelector('.text-nodejs');
    await page.click('.text-nodejs > a');

    await page.waitForSelector('.name-project');

    const link = await page.screenshot();
    expect(link).toMatchImageSnapshot();

  });


});

afterAll(() => {
  browser.close();
});
