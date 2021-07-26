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
    await page.click('.task-name')
    await page.waitForSelector('.detail-modal')

    const taskDetail = await page.screenshot()
    expect(taskDetail).toMatchImageSnapshot()

    // Change title description
    await page.$eval('.input-title', (e) => e.value = '')
    await page.type('.input-title', 'change title')
    await page.$eval('.input-description', (e) => e.value = '')
    await page.type('.input-description', 'change description')

    const changeTitleDescription = await page.screenshot()
    expect(changeTitleDescription).toMatchImageSnapshot()

  // Change priority
    await page.click('.priority-icon')
    await page.waitForSelector('.priority-urgent')

    const changePriority = await page.screenshot()
    expect(changePriority).toMatchImageSnapshot()

    await page.click('.priority-urgent')
    await page.click('.priority-icon')

    const changePrioritySuccess = await page.screenshot()
    expect(changePrioritySuccess).toMatchImageSnapshot()

  //remove assigned user

    await page.waitForSelector('.status-modal .choose-assign-user')
    await page.click('.status-modal .choose-assign-user')
    await page.waitForSelector('.user-accept .name-popup')

    const removeUser = await page.screenshot()
    expect(removeUser).toMatchImageSnapshot()

    await page.click('.user-accept .name-popup')
    await page.click('.status-modal .choose-assign-user')

    const removeUserSuccess = await page.screenshot()
    expect(removeUserSuccess).toMatchImageSnapshot()


  // assign user
    await page.click('.status-modal .choose-assign-user')
    await page.waitForSelector('.user-unaccept .name-popup')
    const assignUser = await page.screenshot()
    expect(assignUser).toMatchImageSnapshot()

    await page.click('.user-unaccept .name-popup')
    await page.click('.status-modal .choose-assign-user')

    const assignUserSuccess = await page.screenshot()
    expect(assignUserSuccess).toMatchImageSnapshot()

  // change status
    // await page.waitForSelector('.detail-modal .status-detail')
    // await page.click('.detail-modal .status-detail')
    // await page.waitForSelector('.popup-status-detail .list-status')
    // const changeStatus = await page.screenshot()
    // expect(changeStatus).toMatchImageSnapshot()

    // await page.click('.item-status.change-status')
    // const changeStatusSuccess = await page.screenshot()
    // expect(changeStatusSuccess).toMatchImageSnapshot()

  // change due date
    // await page.click('.date-time-picker .due-date')
    // await page.waitForSelector('.MuiPickersBasePicker-pickerView')

    // const changeDueDate = await page.screenshot()
    // expect(changeDueDate).toMatchImageSnapshot()

    // await page.click('.MuiPickersCalendar-weekContainer:last-child .MuiPickersDay-dayWithMargin:last-child')
    // await page.waitForSelector('.MuiPickersClock-pin')
    // await page.click('.MuiPickersClock-pin')
    // await page.waitForSelector('.MuiPickersClock-pin')
    // await page.click('.MuiPickersClock-pin')

    // const changeDueDateSuccess = await page.screenshot()
    // expect(changeDueDateSuccess).toMatchImageSnapshot()
    await page.waitFor(5000)
    await page.waitForSelector('.close-detail')
    await page.click('.close-detail')

  // delete task

    const closeDetailModalImage = await page.screenshot()
    expect(closeDetailModalImage).toMatchImageSnapshot()

    await page.waitForSelector('.task-item  .delete-task')
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
    await page.waitForSelector('.delete-status-menu-item')
    await page.click('.delete-status-menu-item')
    await page.waitFor(5000)

    // delete status 'change status'

    await page.waitForSelector('.change-status .action-status-btn')
    await page.click('.change-status .action-status-btn')

    await page.waitForSelector('.popper-action-status')

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
