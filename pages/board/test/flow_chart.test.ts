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

describe('Board Page', () => {

<<<<<<< HEAD
<<<<<<< HEAD:pages/board/test/flow_chart.test.ts
=======
>>>>>>> a192e70d4e2bf23fdae295d5271503121e1155e3
  test('Test UI list board page successfully after login', async () => {
    await page.goto('http://localhost:5000/board');
    await page.waitForSelector('.flowchart');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();

    await page.waitForSelector('.list-board');

    const imageListBoard = await page.screenshot();
    expect(imageListBoard).toMatchImageSnapshot();

    await page.waitForSelector('.check-box');
    await page.click('.check-box');
    await page.waitFor(5000);

    const deleteFlowChart = await page.screenshot();
    expect(deleteFlowChart).toMatchImageSnapshot();

  });

  test('Test UI list board page successfully after login', async () => {
    await page.goto('http://localhost:5000/board');
    await page.waitForSelector('.flowchart');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();

    await page.waitForSelector('.list-board');

    await page.waitForSelector('.btn-primary');
    await page.click('.btn-primary');

    await page.waitForSelector('.back-ground');

    const createFlowChart = await page.screenshot();
    expect(createFlowChart).toMatchImageSnapshot();
<<<<<<< HEAD
=======
  test('Test UI list users page successfully after login', async () => {
    await page.goto('http://localhost:5000/users');
    await page.waitFor(50000);
    await page.waitForSelector('.users');

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
    await page.waitForSelector('.table-content');
    await page.waitForSelector('.table-body');
    await page.waitForSelector('.checkbox-cell');
    await page.waitForSelector('.btn-expanded');
    await page.click('.btn-expanded');
    await page.waitFor(5000);
>>>>>>> 9377e61644e38e8c5b053ce25ccc10de9eb83330:pages/users/test/user.test.ts
=======
>>>>>>> a192e70d4e2bf23fdae295d5271503121e1155e3

  });
});

afterAll(() => {
  browser.close();
});
