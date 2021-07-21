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

describe('EventLogs Page', () => {

  test('Test UI EventLogs page successfully after login', async () => {
    await page.goto('http://localhost:5000/event_logs')
    await page.waitForSelector('.event-container')

    await page.waitForSelector('.event-content div')
    await page.waitFor(5000)

    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot()
  })
})

afterAll(() => {
  browser.close()
})
