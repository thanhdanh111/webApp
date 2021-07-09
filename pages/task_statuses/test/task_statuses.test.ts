let qs = require('qs');
let browser;
let page;
let viewport;

const puppeteer = require('puppeteer');

const token = process.env.TEST_TOKEN;

beforeAll(async () => {

  try {
    browser = await puppeteer.launch({
      headless: false,
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

  // add task

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

  // task detail

    await page.click('.task-name');
    await page.waitFor(5000);
    await page.waitForSelector('.detail-modal');

    const taskDetail = await page.screenshot();
    expect(taskDetail).toMatchImageSnapshot();

  // add tag

    await page.waitForSelector('.tag-add');
    await page.click('.tag-add');
    await page.waitFor(5000);

    const tagAddpopup = await page.screenshot();
    expect(tagAddpopup).toMatchImageSnapshot();

    await page.waitForSelector('.input-search-tag');
    await page.click('.input-search-tag');
    await page.type('.input-search-tag', 'snt-app');
    await page.keyboard.press('Enter');
    await page.waitFor(5000);
    await page.waitForSelector('.tag-item-list');

  // delete tag

    await page.hover('.tag-item-list');
    await page.waitForSelector('.tag-item-list >.more-item-icon');
    await page.click('.tag-item-list >.more-item-icon');
    await page.waitForSelector('.tag-action-popup');

    const actionForTagImage = await page.screenshot();
    expect(actionForTagImage).toMatchImageSnapshot();

    await page.click('.delete-tag');
    await page.waitFor(5000);
    await page.waitForSelector('.confirm-dialog--yes-btn');

    const deleteConfirm = await page.screenshot();
    expect(deleteConfirm).toMatchImageSnapshot();

    await page.click('.confirm-dialog--yes-btn');
    await page.waitFor(5000);

    const deletedTagImage = await page.screenshot();
    expect(deletedTagImage).toMatchImageSnapshot();

    await page.click('.close-detail');
    await page.waitFor(5000);
    await page.click('.close-detail');

  // delete tag

    const closeDetailModalImage = await page.screenshot();
    expect(closeDetailModalImage).toMatchImageSnapshot();

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

    // rename task status
    await page.waitForSelector('.action-status-btn');
    await page.click('.action-status-btn');

    await page.waitForSelector('.popper-action-status');
    await page.waitFor(5000);

    await page.waitForSelector('.rename-status-menu-item');
    await page.click('.rename-status-menu-item');
    await page.type('.add-status-input', 'Testing ReTitle');
    await page.click('.submit-create-status');
    await page.waitFor(5000);

  // delete status tag

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

  // test('Test rename taskStatus successfully after login', async () => {
    // await page.goto('http://localhost:5000/home');
    // await page.waitForSelector('.board');
    // await page.waitForSelector('.status');
//
    // await page.waitForSelector('.action-status-btn');
    // await page.click('.action-status-btn');
//
    // await page.waitForSelector('.popper-action-status');
    // await page.waitFor(5000);
//
    // await page.waitForSelector('.rename-status-menu-item');
    // await page.click('.rename-status-menu-item');
    // await page.type('.add-status-input', 'Testing ReTitle');
    // await page.click('.submit-create-status');
    // await page.waitFor(5000);
//
    // const actionRetitleStatus = await page.screenshot();
    // expect(actionRetitleStatus).toMatchImageSnapshot();
  // });

});

afterAll(() => {
  browser.close();
});
