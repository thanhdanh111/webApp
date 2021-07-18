let browser
let page
// let token
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
    viewport = await page.setViewport({ width: 1853 , height: 951 })

    await page.goto('http://localhost:5000')

    await page.evaluate((token) => {
      localStorage.setItem('access_token', token)
    }, token)
  } catch (error) {
    console.log(error)
  }
})

describe('Pots Page', () => {
  test('Test statistics page successfully after login', async () => {
    await page.goto('http://localhost:5000/home')
    await page.waitForSelector('.board')
    await page.waitForSelector('.status')

    await page.waitForSelector('.add-task-text')
    await page.click('.add-task-text')
    await page.waitForSelector('.add-status-modal')

    await page.click('.add-status-input')
    await page.type('.add-status-input', 'close')

    await page.click('.submit-create-status')
    await page.click('.close-create-status')

    await page.waitForSelector('.close .add-task')

    await page.click('.close .add-task')
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
    await page.waitForSelector('.tag-add')
    await page.click('.tag-add')

    const tagAddpopup = await page.screenshot()
    expect(tagAddpopup).toMatchImageSnapshot()

    await page.waitForSelector('.input-search-tag')
    await page.click('.input-search-tag')
    await page.type('.input-search-tag', 'snt-app')
    await page.keyboard.press('Enter')
    await page.waitFor(5000)
    await page.waitForSelector('.tag-item-list')

  // delete tag
    await page.hover('.tag-item-list')
    await page.waitForSelector('.tag-item-list >.more-item-icon')
    await page.click('.tag-item-list >.more-item-icon')
    await page.waitForSelector('.tag-action-popup')

    await page.click('.delete-tag')
    await page.waitForSelector('.confirm-dialog--yes-btn')
    await page.click('.confirm-dialog--yes-btn')
    await page.click('.confirm-dialog--no-btn')

    await page.waitForSelector('.close-detail')
    await page.click('.close-detail')
    await page.click('.close-detail')

    const closeDetailModalImage = await page.screenshot()
    expect(closeDetailModalImage).toMatchImageSnapshot()

    // delete task
    await page.waitFor(5000)
    await page.waitForSelector('.task-item  .delete-task')
    await page.click('.close .delete-task')

    const deletedTaskImage = await page.screenshot()
    expect(deletedTaskImage).toMatchImageSnapshot()

    await page.waitForSelector('.deleted-task-dialog .confirm-dialog-actions')
    await page.click('.confirm-dialog--yes-btn')
    await page.waitFor(5000)
    await page.waitForSelector('.board-tasks')

    const confirmDeletedTaskImage = await page.screenshot()
    expect(confirmDeletedTaskImage).toMatchImageSnapshot()

  // delete status

    await page.waitForSelector('.close .action-status-btn')
    await page.click('.close .action-status-btn')

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
