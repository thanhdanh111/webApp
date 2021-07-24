let qs = require('qs')
let browser
let page
let viewport

const puppeteer = require('puppeteer')

const token = process.env.TEST_TOKEN

const requiredReponses = [
  {
    endpoint: '/docProjects',
    status: 200,
  },
  {
    endpoint: '/docPages',
    status: 200,
  },
  {
    endpoint: '/userAccesses',
    status: 200,
  },
]

function checkStatusOfEndpoint(url, status) {

  return requiredReponses.some((response) => url.includes(response.endpoint) && status === response.status)
}

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

    await page.goto('http://localhost:5000/docs')

    await page.waitForResponse((response) => checkStatusOfEndpoint(response.url(), response.status()))
  } catch (error) {
    console.log(error)
  }
})

describe('docs page', () => {
  test('main docs page', async () => {
    await page.waitForSelector('.docs-page')

    const image = await page.screenshot()
    expect(image).toMatchImageSnapshot()
  })

  test('open dialog to create project', async () => {
    await page.waitForSelector('.docs-drawer--add-new-project')
    await page.click('.docs-drawer--add-new-project')
    await page.waitForSelector('.docs-drawer--new-project-dialog')
    await page.waitFor(5000)

    const createNewProject = await page.screenshot()
    expect(createNewProject).toMatchImageSnapshot()

    await page.waitForSelector('.confirm-dialog--close-btn')
    await page.click('.confirm-dialog--close-btn')
    await page.waitFor(5000)
  })

  test('select page', async () => {
    await page.waitForSelector('.doc-page-item')
    await page.click('.doc-page-item')
    await page.waitFor(5000)

    const pageContent = await page.screenshot()
    expect(pageContent).toMatchImageSnapshot()
  })
})

afterAll(() => {
  browser.close()
})
