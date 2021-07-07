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

    viewport = await page.setViewport({ width: 1853 , height: 951 });

    await page.goto('http://localhost:5000');

    await page.evaluate((token) => {
      localStorage.setItem('access_token', token);
    }, token);

  } catch (error) {
    console.log(error);
  }
});

describe('Home page', () => {
  test('Test get taskStatuses successfully after login', async () => {
    await page.goto('http://localhost:5000/home');
    await page.waitForSelector('.board');
    await page.waitForSelector('.status');

    const status = await page.screenshot();
    expect(status).toMatchImageSnapshot();
  });

  test('Test add taskStatus successfully after login', async () => {
    await page.goto('http://localhost:5000/home');
    await page.waitForSelector('.board');
    await page.waitForSelector('.status');

    await page.waitForSelector('.add-task-text');
    await page.click('.add-task-text');
    await page.waitForSelector('.add-status-modal');

    const addStatus = await page.screenshot();
    expect(addStatus).toMatchImageSnapshot();
  });

  test('Test actions taskStatus successfully after login', async () => {
    await page.goto('http://localhost:5000/home');
    await page.waitForSelector('.board');
    await page.waitForSelector('.status');

    await page.waitForSelector('.action-status-btn');
    await page.click('.action-status-btn');

    await page.waitForSelector('.popper-action-status');
    await page.waitFor(5000);

    const actionStatus = await page.screenshot();
    expect(actionStatus).toMatchImageSnapshot();

    await page.click('.rename-status-menu-item');

    await page.waitForSelector('.add-status-input');
    await page.waitFor(5000);

    const actionRetitleStatus = await page.screenshot();
    expect(actionRetitleStatus).toMatchImageSnapshot();
  });
  test('Test actions taskStatus successfully after login', async () => {
    await page.goto('http://localhost:5000/home');
    await page.waitForSelector('.board');
    await page.waitForSelector('.status');

    await page.waitForSelector('.action-status-btn');
    await page.click('.action-status-btn');

    await page.waitForSelector('.popper-action-status');
    await page.waitFor(5000);
    await page.click('.rename-status-menu-item');

    await page.waitForSelector('.add-status-input');
    await page.waitFor(5000);

    const actionRetitleStatus = await page.screenshot();
    expect(actionRetitleStatus).toMatchImageSnapshot();
  });

});

afterAll(() => {
  browser.close();
});
