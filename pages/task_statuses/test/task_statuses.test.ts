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

    const status = await page.screenshot();
    expect(status).toMatchImageSnapshot();
  });

  test('Test add and delete taskStatus successfully after login', async () => {
    await page.goto('http://localhost:5000/home');
    await page.waitForSelector('.board');
    await page.waitForSelector('.status');
    await page.waitFor(5000);

    await page.waitForSelector('.add-task-text');
    await page.click('.add-task-text');
    await page.waitForSelector('.add-status-modal');

    const addStatus = await page.screenshot();
    expect(addStatus).toMatchImageSnapshot();

    await page.waitFor(5000);
    await page.click('.add-status-input');
    await page.type('.add-status-input', 'Testing');

    const chooseUserAssignImg = await page.screenshot();
    expect(chooseUserAssignImg).toMatchImageSnapshot();

    await page.click('.submit-create-status');
    await page.waitForSelector('.testing .status');

    const confirmAddStatus = await page.screenshot();
    expect(confirmAddStatus).toMatchImageSnapshot();

    // rename task status
    await page.waitForSelector('.testing .action-status-btn');
    await page.click('.testing .action-status-btn');

    await page.waitForSelector('.popper-action-status');
    await page.waitFor(5000);

    await page.waitForSelector('.rename-status-menu-item');
    await page.click('.rename-status-menu-item');
    await page.$eval('.add-status-input', (el) => el.value = '');
    await page.type('.add-status-input', 'Testing ReTitle');
    await page.click('.testing .submit-create-status');
    await page.waitFor(5000);

  // delete status task

    await page.waitForSelector('.testing-retitle .action-status-btn');
    await page.click('.testing-retitle .action-status-btn');

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

});

afterAll(() => {
  browser.close();
});
