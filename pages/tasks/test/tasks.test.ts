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
  test('Test get tasks successfully after login', async () => {
    await page.goto('http://localhost:5000/home');
    await page.waitForSelector('.board');
    await page.waitForSelector('.board-tasks');
    await page.waitForSelector('.task-status');

    await page.waitForSelector('.add-task');
    await page.waitFor(5000);

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();

  });
  test('Test add and delete task successfully after login', async () => {
    await page.goto('http://localhost:5000/home');
    await page.waitForSelector('.board');
    await page.waitForSelector('.board-tasks');
    await page.waitForSelector('.task-status');

    await page.waitForSelector('.add-task');
    await page.waitFor(5000);
    await page.click('.add-task');
    await page.waitForSelector('.task-add');
    await page.waitFor(5000);

    const addTaskImage = await page.screenshot();
    expect(addTaskImage).toMatchImageSnapshot();

    await page.waitForSelector('input[name=title]');

    await page.click('input[name=title]');
    await page.type('input[name=title]', 'feat/created task for task');

    await page.waitForSelector('.save-add');
    await page.click('.save-add');

    await page.waitFor(5000);
    await page.waitForSelector('.task-item');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();

    await page.waitForSelector('.footer-task');
    await page.waitForSelector('.delete-task');
    await page.click('.delete-task');
    await page.waitFor(5000);

    const deletedTaskImage = await page.screenshot();
    expect(deletedTaskImage).toMatchImageSnapshot();

    await page.waitForSelector('.confirm-dialog--yes-btn');
    await page.click('.confirm-dialog--yes-btn');
    await page.waitFor(5000);
    await page.waitForSelector('.board-tasks');

    const confirmDeletedTaskImage = await page.screenshot();
    expect(confirmDeletedTaskImage).toMatchImageSnapshot();
  });
});

afterAll(() => {
  browser.close();
});
