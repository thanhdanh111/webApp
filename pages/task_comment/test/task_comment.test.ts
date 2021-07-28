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
  test('Test home successfully after login', async () => {
    await page.goto('http://localhost:5000/home')
    await page.waitForSelector('.board')
    await page.waitForSelector('.status')
  // add statuss open
    await page.waitForSelector('.add-task-text')
    await page.click('.add-task-text')
    await page.waitForSelector('.add-status-modal')

    await page.click('.add-status-input')
    await page.type('.add-status-input', 'open')

    await page.click('.submit-create-status')
    await page.click('.close-create-status')
  // add status change status
    await page.click('.add-task-text')
    await page.waitForSelector('.add-status-modal')

    await page.click('.add-status-input')
    await page.type('.add-status-input', 'change status')

    await page.click('.submit-create-status')
    await page.click('.close-create-status')
  // add task
    await page.waitForSelector('.open .add-task')

    await page.click('.open .add-task')
    await page.waitForSelector('.task-add')

    await page.waitForSelector('input[name=title]')

    await page.click('input[name=title]')
    await page.type('input[name=title]', 'feat/created task for task')

    await page.waitForSelector('.save-add')
    await page.click('.save-add')

  // task detail
    await page.waitFor(5000)
    await page.click('.task-name')
    await page.waitForSelector('.detail-modal')

    const taskDetail = await page.screenshot()
    expect(taskDetail).toMatchImageSnapshot()

  })
})

afterAll(() => {
  browser.close()
})
