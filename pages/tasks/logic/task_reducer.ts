import { Tag, Task, TaskBoard, User, UserInfoType } from '../../../helpers/type'
import axios from 'axios'
import { config } from '../../../helpers/get_config'
import { taskActionType } from './task_action_type'
import {
  createdTask,
  deletedTask,
  getTaskByID,
  getTasks,
  resetTasksByCurrentTaskBoar,
  setAssigned,
  setFiltering,
  setLoading,
  setTempararyTask,
  updateUserAssigned,
} from './task_action'
import { convertArrayObjectToObject, convertArrayStringToObject } from '../../../helpers/convert_array_to_object'
import { pushNewNotifications } from 'redux/common/notifications/reducer'
import { returnNotification } from 'pages/invite_members/logic/invite_error_notifications'
import { checkArrayObjectHasObjectByKey } from 'helpers/check_in_array'
import { setCurrentStatus } from 'pages/task_statuses/logic/task_statuses_action'
import { removeTasksFfromStatus, setTasksToStatus } from 'pages/task_boards/logic/task_boards_action'
import { checkTrueInArray } from 'helpers/check_true_in_array'

export interface TaskType {
  loading: boolean
  tasks: { [key: string]: Task }
  cursorTask?: string
  totalCountTask: number
  limitTasks?: number
  temporaryTask: Task
  temporaryAssigned: User[]
  selectedTitle: string
  selectedTags: Tag[]
  selectedUserIDs: User[]
  filteringTaskByUser: boolean
  currentTask: Task
  isFiltering: boolean
}

const initialState: TaskType = {
  loading: false,
  tasks: {},
  limitTasks: 100,
  cursorTask: '',
  totalCountTask: 0,
  temporaryTask: {
    _id: '',
    taskStatusID: { _id: '', taskIDs: [], taskBoardID: '', title: '' },
    title: '',
  },
  temporaryAssigned: [],
  selectedTitle: '',
  selectedTags: [],
  selectedUserIDs: [],
  filteringTaskByUser: false,
  currentTask: {
    _id: '',
    title: '',
    taskStatusID: { _id: '', taskIDs: [], taskBoardID: '', title: '' },
  },
  isFiltering: false,
}

// tslint:disable-next-line:cyclomatic-complexity
export const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case taskActionType.SET_LOADING:
      return { ...state, loading: action.payload }
    case taskActionType.GET_TASKS:
      let cursorTask = action.payload?.cursorTask
      const tasksObject = action.payload?.tasks

      if (Object.keys(tasksObject)?.length >= action.payload.totalCount) {
        cursorTask = 'END'
      }

      if (state.isFiltering) {
        cursorTask = undefined
      }

      return {
        ...state,
        cursorTask,
        tasks: { ...state.tasks, ...tasksObject },
        totalCountTask: action.payload?.totalCountTask,
      }
    case taskActionType.RESET_TASKS_BY_CURRENT_TASK_BOARD:
      return {
        ...state,
        tasks: {},
        cursorTask: null,
      }
    case taskActionType.SET_FILTERING:
      return {
        ...state,
        isFiltering: action.payload,
      }
    case taskActionType.SET_ASSIGNED:

      return {
        ...state,
        temporaryAssigned: action.payload,
      }
    case taskActionType.SET_TEMPORARY_TASK:
      return {
        ...state,
        temporaryTask: action.payload,
      }
    case taskActionType.CREATE_TASK:
      const newTasks = {
        ...state.tasks,
        [action?.payload?._id]: action?.payload,
      }

      return {
        ...state,
        tasks: newTasks,
      }
    case taskActionType.UPDATE_USER_ASSIGN_FOR_TASK:
      const tasks = {
        ...state.tasks,
        [action?.payload?._id]: action?.payload,
      }

      return {
        ...state,
        tasks,
      }
    case taskActionType.DELETE_TASK:
      const tempTask = state.tasks
      const deleteTaskID = action?.payload
      const status = delete tempTask[deleteTaskID]

      if (!status) {
        return {
          ...state,
        }
      }

      return {
        ...state,
        tasks: tempTask,
      }
    case taskActionType.GET_TASK_BY_ID:
      return {
        ...state,
        currentTask: action.payload,
      }
    case taskActionType.SET_SELECTED_TAGS:
      const templateSelectedTags = state.selectedTags

      if (checkArrayObjectHasObjectByKey(templateSelectedTags, action.payload?._id, '_id')) {
        const removeTag = templateSelectedTags.filter(
          (each) => each !== action.payload)

        return {
          ...state,
          selectedTags: removeTag,
        }
      }

      const addTag = [...templateSelectedTags, action.payload]

      return {
        ...state,
        selectedTags: addTag,
      }
    case taskActionType.SET_SELECTED_USERS:
      return {
        ...state,
        selectedUserIDs: action.payload,
      }
    case taskActionType.SET_SELECTED_TITLE:
      return {
        ...state,
        selectedTitle: action.payload,
      }
    case taskActionType.SET_FILLTERING_BY_CURRENT_USER:
      return {
        ...state,
        filteringTaskByUser: action.payload,
      }
    default:
      return state
  }
}

enum NotificationTypes {
  failCreateTask = 'Failed Create Task',
  succeedCreateTask = 'Create Task Successfully',
  succedDeleteTask = 'Delete Task Successfully',
  failDeleteTask = 'Failed Delete Task',
}

export const getTasksThunkAction = (currentTaskBoard: TaskBoard) => async (dispatch, getState) => {
  try {
    await dispatch(setLoading(true))

    const token = localStorage.getItem('access_token')
    const { currentCompany, userID }: UserInfoType = getState().userInfo
    const companyID = currentCompany?._id
    const {
      selectedTitle,
      selectedTags,
      selectedUserIDs,
      filteringTaskByUser,
      limitTasks,
      cursorTask,
    }: TaskType = getState().tasks
    const tags = selectedTags?.map((tag) => tag?._id)
    const tempUserIDs = selectedUserIDs?.map((user) => user?._id)
    const title = selectedTitle
    const tempStatuses = currentTaskBoard?.taskStatusIDs?.map((each) => each?._id)

    let cursor = cursorTask

    if (cursor === 'END') {
      return
    }

    const validData = checkTrueInArray({
      conditionsArray: [
        !!selectedTags?.length,
        !!selectedUserIDs?.length,
        !!filteringTaskByUser,
        !!title,
      ],
    })

    await dispatch(setFiltering(validData))

    if (validData) {
      cursor = undefined
      await dispatch(resetTasksByCurrentTaskBoar())
    }

    if (filteringTaskByUser) {
      tempUserIDs.push(userID)
    }

    const userIDs = convertArrayStringToObject(tempUserIDs, 'userIDs')
    const taskStatusIDs = convertArrayStringToObject(tempStatuses as string[], 'taskStatusIDs')

    const res = await axios.get(`${config.BASE_URL}/tasks`, {
      params: {
        companyID,
        tags,
        ...userIDs,
        title,
        ...taskStatusIDs,
        cursor,
        limit: limitTasks,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    const formatData = res.data?.list.map((each) => {
      return {
        ...each,
        taskStatusID: each?.taskStatusID?._id || each?.taskStatuaID,
      }
    })

    const tasks = convertArrayObjectToObject<Task>(formatData, '_id')

    await dispatch(getTasks({ tasks, cursorTask: res.data?.cursor, totalCountTask: res.data?.totalCount }))
    await dispatch(setLoading(false))
  } catch (error) {
    await dispatch(setLoading(false))
  }
}

export const createdTaskThunkAction = (data) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const userInfo = getState()?.userInfo
    const companyID = userInfo?.currentCompany?._id

    await dispatch(setLoading(true))
    await dispatch(setTempararyTask(data))

    if (!token || !companyID) {
      dispatch(pushNewNotifications({ variant: 'error', message: NotificationTypes.failCreateTask }))

      return
    }

    const res = await axios.post(`${config.BASE_URL}/companies/${companyID}/tasks`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    await Promise.all([
      dispatch(createdTask(res?.data)),
      dispatch(setTasksToStatus({ taskStatusID: data?.taskStatusID, tasks: res?.data })),
      dispatch(pushNewNotifications({ variant: 'success', message: NotificationTypes.succeedCreateTask })),
      dispatch(setCurrentStatus('')),
      dispatch(resetTermTask()),
    ])
    await dispatch(setLoading(false))
  } catch (error) {
    await dispatch(
      pushNewNotifications({
        variant: 'error',
        message:
          error?.response?.data?.message || NotificationTypes.failCreateTask,
      }),
    )

    await dispatch(setLoading(false))
  }
}

export const deletedTaskThunkAction = (data: { taskID: string, taskStatusID: string }) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const userInfo = getState()?.userInfo
    const companyID = userInfo?.currentCompany?._id

    if (!token || !data.taskID || !companyID) {
      return
    }

    const res = await axios({
      url: `${config.BASE_URL}/companies/${companyID}/tasks/${data.taskID}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
    })

    if (!res.data) {
      await dispatch(setLoading(false))
      await dispatch(pushNewNotifications({ variant: 'success', message: NotificationTypes.succedDeleteTask }))

      return
    }

    await Promise.all([
      dispatch(deletedTask(data.taskID)),
      dispatch(removeTasksFfromStatus({ taskID: data.taskID, taskStatusID: data.taskStatusID })),
      dispatch(setLoading(false)),
      dispatch(pushNewNotifications({ variant: 'success', message: 'Deleted task by taskID successfully!' })),
    ])
  } catch (error) {
    await dispatch(pushNewNotifications({ variant: 'error', message: NotificationTypes.failDeleteTask }))
    await dispatch(setLoading(false))
  }
}

export const updateAssignUserThunkAction = (
  taskID: string,
  assignUserIDs?: string[],
) => async (dispatch, getState) => {
  try {
    const localAccess = localStorage.getItem('access_token')
    const companyID = getState().userInfo.currentCompany._id
    const currentTask = getState().tasks.currentTask

    if (!companyID || !taskID) {
      return
    }

    const res = await axios({
      data: {
        userIDs: assignUserIDs,
      },
      url: `${config.BASE_URL}/companies/${companyID}/tasks/${taskID}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localAccess}`,
      },
      method: 'PUT',
    })

    const formatData = {
      ...res?.data,
      taskStatusID: res?.data?.taskStatusID?._id || res?.data?.taskStatuaID,
    }

    if (taskID === currentTask?._id) {
      dispatch(getTaskByID(res.data))
    }

    await dispatch(updateUserAssigned(formatData))
    await dispatch(setLoading(false))
    await dispatch(pushNewNotifications({ variant: 'success', message: 'updated users assigned for task successfully!' }))
  } catch (error) {
    const errorNotification = returnNotification({ type: 'failed' })
    await dispatch(pushNewNotifications({ variant: 'error', message: errorNotification['message'] }))
  }
}

export const getTaskByIDThunkAction = (taskID: string) => async (dispatch, getState) => {
  try {
    await dispatch(setLoading(true))

    const token = localStorage.getItem('access_token')
    const { currentCompany }: UserInfoType = getState().userInfo
    const companyID = currentCompany?._id

    if (!token || !companyID || !taskID) {
      return
    }

    const res = await axios.get(`${config.BASE_URL}/companies/${companyID}/tasks/${taskID}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    await dispatch(getTaskByID(res.data))
    await dispatch(setLoading(false))
  } catch (error) {
    await dispatch(setLoading(false))
  }
}

// export const getTaskByCurrentUserThunkAction = () => async (dispatch, getState) => {
//   try {
//     await dispatch(setLoading(true))
//     const token = localStorage.getItem('access_token')
//     const { currentCompany, userID }: UserInfoType = getState().userInfo
//     const companyID = currentCompany?._id

//     const userIDs = {
//       [0]: userID,
//     }

//     if (!token) {
//       return
//     }

//     const res = await axios.get(`${config.BASE_URL}/tasks`, {
//       params: {
//         ...userIDs,
//         companyID,
//       },
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//     })

//     if (!checkIfEmptyArray(res?.data?.list)) {
//       await dispatch(setLoading(false))

//       return
//     }

//     const formatData = res.data?.list.map((each) => {
//       return {
//         ...each,
//         taskStatusID: each?.taskStatusID?._id || each?.taskStatuaID,
//       }
//     })

//     const tasks = convertArrayObjectToObject<Task>(formatData, '_id')

//     await dispatch(getTaskByCurrentUser(tasks))
//     await dispatch(setLoading(false))
//   } catch (error) {
//     throw error
//   }
// }
export const updateTaskThunkAction = (taskID, dataUpdateTask) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const companyID = getState()?.userInfo?.currentCompany?._id
    const { tasks }: { tasks: { [key: string]: Task } } = getState().tasks

    if (!token || !companyID) {

      return
    }

    const res = await axios.put(`${config.BASE_URL}/companies/${companyID}/tasks/${taskID}`,
      dataUpdateTask,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

    if (taskID === getState()?.tasks?.currentTask?._id) {
      dispatch(getTaskByID(res.data))
    }
    tasks[res.data?._id] = res.data
    dispatch(getTasks({ tasks }))
  } catch (error) {
    throw error
  }
}

export const resetTermTask = () => (dispatch) => {
  dispatch(setAssigned(''))
  dispatch(setTempararyTask({
    _id: '',
    taskStatusID: { _id: '', taskIDs: [], taskBoardID: '', title: '' },
    title: '',
  }))
}
