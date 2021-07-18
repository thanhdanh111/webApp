let qs = require('qs')
let browser
let page
let viewport

const puppeteer = require('puppeteer')

const token = process.env.TEST_TOKEN

beforeAll(async () => {

  try {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 0,
      ignoreDefaultArgs: ['--no-sandbox'],
    })

    page = await browser.newPage()

    viewport = await page.setViewport({ width: 1853 , height: 951 })

    await page.goto('http://localhost:5000')

    await page.evaluate((token) => {
      localStorage.setItem('access_token', token)
    }, token)

  } catch (error) {
    console.log(error)
  }
})

describe('Home page', () => {
  test('Test get tasks successfully after login', async () => {
    await page.goto('http://localhost:5000/home')
    await page.waitForSelector('.board')
    await page.waitForSelector('.board-tasks')
    await page.waitForSelector('.status')

    await page.waitForSelector('.add-task-text')
    await page.click('.add-task-text')
    await page.waitForSelector('.add-status-modal')
    await page.click('.add-status-input')
    await page.type('.add-status-input', 'open')

    await page.waitForSelector('.status-left')

    const addStatusImage = await page.screenshot()
    expect(addStatusImage).toMatchImageSnapshot()

    await page.click('.submit-create-status')
    await page.waitForSelector('.status')
    await page.waitFor(5000)

    const addSuccessStatusImage = await page.screenshot()
    expect(addSuccessStatusImage).toMatchImageSnapshot()

      // add task

    await page.waitForSelector('.task-status .open')
    await page.waitForSelector('.open .add-task')

    await page.click('.open .add-task')
    await page.waitForSelector('.task-add')

    const addTaskImage = await page.screenshot()
    expect(addTaskImage).toMatchImageSnapshot()

    await page.waitForSelector('input[name=title]')

    await page.click('input[name=title]')
    await page.type('input[name=title]', 'feat/created task for task')

    await page.waitForSelector('.save-add')
    await page.click('.save-add')

    await page.waitFor(5000)

    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot()

  // task detail
    await page.waitFor(5000)
    await page.click('.open .task-name')
    await page.waitForSelector('.detail-modal')

    const taskDetail = await page.screenshot()
    expect(taskDetail).toMatchImageSnapshot()

    await page.click('.close-detail')

  // delete task

    const closeDetailModalImage = await page.screenshot()
    expect(closeDetailModalImage).toMatchImageSnapshot()

    await page.waitForSelector('.open  .footer-task')
    await page.waitForSelector('.open  .delete-task')
    await page.click('.open .delete-task')
    await page.waitFor(5000)

    const deletedTaskImage = await page.screenshot()
    expect(deletedTaskImage).toMatchImageSnapshot()

    await page.waitForSelector('.confirm-dialog--yes-btn')
    await page.click('.confirm-dialog--yes-btn')
    await page.click('.confirm-dialog--no-btn')
    await page.waitFor(5000)
    await page.waitForSelector('.board-tasks')

    const confirmDeletedTaskImage = await page.screenshot()
    expect(confirmDeletedTaskImage).toMatchImageSnapshot()

  // delete status

    await page.waitForSelector('.open .action-status-btn')
    await page.click('.open .action-status-btn')

    await page.waitForSelector('.popper-action-status')
    await page.waitFor(5000)

    await page.waitForSelector('.delete-status-menu-item')
    await page.click('.delete-status-menu-item')
    await page.waitFor(5000)

    const deleteStatusSuccessImg = await page.screenshot()
    expect(deleteStatusSuccessImg).toMatchImageSnapshot()
  })

})

afterAll(() => {
  browser.close()
})
