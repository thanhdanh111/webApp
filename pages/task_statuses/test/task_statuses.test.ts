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
    await page.waitFor(5000);
    await page.waitForSelector('.status-left');

    const status = await page.screenshot();
    expect(status).toMatchImageSnapshot();
  });

  test('Test add and delete taskStatus successfully after login', async () => {
    await page.goto('http://localhost:5000/home');
    await page.waitForSelector('.board');
    await page.waitForSelector('.status');
    await page.waitFor(5000);
    await page.waitForSelector('.status-left');

    await page.waitForSelector('.add-task-text');
    await page.click('.add-task-text');
    await page.waitForSelector('.add-status-modal');

    const addStatus = await page.screenshot();
    expect(addStatus).toMatchImageSnapshot();

    await page.waitFor(5000);
    await page.click('.add-status-input');
    await page.type('.add-status-input', 'Testing');
    await page.click('.submit-create-status');
    await page.waitForSelector('.status');

    const confirmAddStatus = await page.screenshot();
    expect(confirmAddStatus).toMatchImageSnapshot();

    await page.waitForSelector('.action-status-btn');
    await page.click('.action-status-btn');

    await page.waitForSelector('.popper-action-status');
    await page.waitFor(5000);

    const actionsStatusPopup = await page.screenshot();
    expect(actionsStatusPopup).toMatchImageSnapshot();

    await page.waitForSelector('.delete-status-menu-item');
    await page.click('.delete-status-menu-item');
    await page.waitFor(5000);

    const deleteStatusSuccessImg = await page.screenshot();
    expect(deleteStatusSuccessImg).toMatchImageSnapshot();
  });

  test('Test rename taskStatus successfully after login', async () => {
    await page.goto('http://localhost:5000/home');
    await page.waitForSelector('.board');
    await page.waitForSelector('.status');

    await page.waitForSelector('.action-status-btn');
    await page.click('.action-status-btn');

    await page.waitForSelector('.popper-action-status');
    await page.waitFor(5000);

    await page.waitForSelector('.rename-status-menu-item');
    await page.click('.rename-status-menu-item');
    await page.type('.add-status-input', 'Testing ReTitle');
    await page.click('.submit-create-status');
    await page.waitFor(5000);

    const actionRetitleStatus = await page.screenshot();
    expect(actionRetitleStatus).toMatchImageSnapshot();
  });

});

afterAll(() => {
  browser.close();
});
