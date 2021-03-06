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
    await page.waitForSelector('.home-page')

    await page.waitForSelector('.board')
    await page.waitForSelector('.board-tasks')
    await page.waitForSelector('.task-status')
    await page.waitFor(5000)

    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot()
  })

})

afterAll(() => {
  browser.close()
})
