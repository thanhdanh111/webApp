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

    await page.waitForSelector('.add-task-board')
    await page.click('.btn-add-task-board')

    await page.waitFor(5000)

    const createTaskBoard = await page.screenshot()
    expect(createTaskBoard).toMatchImageSnapshot()

    await page.waitForSelector('.nav-click-up-task-board-select')
    await page.click('.nav-click-up-task-board-select')

    const showTaskBoards = await page.screenshot()
    expect(showTaskBoards).toMatchImageSnapshot()
  })
  test('Test search tasks by title successfully after login', async () => {
    await page.goto('http://localhost:5000/home')
    await page.waitForSelector('.board')

    await page.waitForSelector('.status')
    await page.waitFor(5000)
    await page.waitForSelector('.nav-input-search')

    await page.click('.nav-input-search')
    await page.type('.nav-input-search', 'test')
    await page.waitFor(5000)

    const showTaskBoards = await page.screenshot()
    expect(showTaskBoards).toMatchImageSnapshot()
  })
  test('Test search tasks by userIDs successfully after login', async () => {
    await page.goto('http://localhost:5000/home')
    await page.waitForSelector('.board')

    await page.waitForSelector('.status')
    await page.waitFor(5000)
    await page.waitForSelector('.action-status-btn-menu-content')

    await page.click('.action-status-btn-menu-content')
    await page.waitForSelector('.menu-item-users-popup')

    await page.click('.menu-item-users-popup')
    await page.waitFor(5000)

    const showTaskBoards = await page.screenshot()
    expect(showTaskBoards).toMatchImageSnapshot()
  })
})

afterAll(() => {
  browser.close()
})
