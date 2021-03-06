let browser
let page
let viewport
const token = process.env.TEST_TOKEN

const puppeteer = require('puppeteer')
beforeAll(async () => {
  try {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 0,
      ignoreDefaultArgs: ['--no-sandbox'],
    })

    page = await browser.newPage()

    viewport = await page.setViewport({ width: 1920 , height: 835 })

    await page.goto('http://localhost:5000/')

    await page.evaluate((token) => {
      localStorage.setItem('access_token', token)
    }, token)

  } catch (error) {
    console.log(error)
  }
})

describe('Users Page', () => {

  test('Test UI list users page successfully after login', async () => {
    await page.goto('http://localhost:5000/time_off')

    const timeOffPage = await page.screenshot()

    await page.waitForSelector('.request-time-off-btn')
    await page.click('.request-time-off-btn')
    await page.waitForSelector('.request-dialog-content')
    await page.waitFor(5000)
    const requestDialogContent = await page.screenshot()

    expect(timeOffPage).toMatchImageSnapshot()
    expect(requestDialogContent).toMatchImageSnapshot()
  })

})

afterAll(() => {
  browser.close()
})
