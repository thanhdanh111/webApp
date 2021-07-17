import { Tag, Task, User, UserInfoType } from '../../../helpers/type'
import axios from 'axios'
import { config } from '../../../helpers/get_config'
import { taskActionType } from './task_action_type'
import {
  createdTask,
  deletedTask,
  getTasks,
  setAssigned,
  setLoading,
  setTempararyTask,
  updateStatusForTask,
  updateUserAssigned,
} from './task_action'
import { convertArrayObjectToObject, convertArrayStringToObject } from '../../../helpers/convert_array_to_object'
import { pushNewNotifications } from 'redux/common/notifications/reducer'
import { returnNotification } from 'pages/invite_members/logic/invite_error_notifications'
import { setCurrentStatus } from 'pages/task_statuses/logic/task_statuses_action'
import { checkIfEmptyArray } from 'helpers/check_if_empty_array'
import { checkArrayObjectHasObjectByKey } from 'helpers/check_in_array'
import { removeTasksFfromStatus } from 'pages/task_boards/logic/task_boards_action'

// interface UpdateTask {
//   taskStatusID: string
//   title?: string
//   description?: string
//   dueDate?: string
//   estimateDate?: string
//   timeTracked?: string
//   priority?: string
//   tagIDs?: string[]
//   newIndex?: number
// }

// interface IUpdateTask {
//   taskID: string
//   data: UpdateTask
//   sourceTaskStatusID: string
//   destinationTasks: Task[]
//   sourceTasks: Task[]
// }

export interface TaskType {
  loading: boolean
  tasks: { [key: string]: Task }
  limitTasks: number
  temporaryTask: Task
  temporaryAssigned: User[]
  selectedTitle: string
  selectedTags: Tag[]
  selectedUserIDs: User[]
  filteringTaskByUser: boolean
  currentTask: Task
}

const initialState: TaskType = {
  loading: false,
  tasks: {},
  limitTasks: 100,
  temporaryTask: {
    _id: '',
    taskStatusID: '',
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
    taskStatusID: '',
  },
}

// tslint:disable-next-line:cyclomatic-complexity
export const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case taskActionType.SET_LOADING:
      return { ...state, loading: action.payload }
    case taskActionType.GET_TASKS:

      return {
        ...state,
        tasks: action.payload,
      }
    case taskActionType.SET_ASSIGNED:

      return {
        ...state,
        temporaryAssigned: action.payload,
      }
    case taskActionType.SET_TEMPORARY_TASK:
      return {
        ...state,
        temporaryTask: { ...action.payload },
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
    case taskActionType.UPDATE_STATUS_FOR_TASK:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload?._id]: action.payload,
        },
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

export const getTasksThunkAction = (currentTaskBoard) => async (dispatch, getState) => {
  try {
    await dispatch(setLoading(true))
    const token = localStorage.getItem('access_token')
    const { currentCompany, userID }: UserInfoType = getState().userInfo
    const companyID = currentCompany?._id
    const { selectedTitle, selectedTags, selectedUserIDs, filteringTaskByUser }: TaskType = getState().tasks
    const tags = selectedTags?.map((tag) => tag?._id)
    const tempUserIDs = selectedUserIDs?.map((user) => user?._id)
    const title = selectedTitle ? selectedTitle : null
    const tempStatuses = currentTaskBoard?.taskStatusIDs?.map((each) => each._id) || []

    if (filteringTaskByUser) {
      tempUserIDs.push(userID)
    }

    const userIDs = convertArrayStringToObject(tempUserIDs, 'userIDs')
    const taskStatusIDs = convertArrayStringToObject(tempStatuses, 'taskStatusIDs')

    const res = await axios.get(`${config.BASE_URL}/tasks`, {
      params: {
        companyID,
        tags,
        ...userIDs,
        title,
        ...taskStatusIDs,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!checkIfEmptyArray(res?.data?.list)) {
      await dispatch(setLoading(false))

      return
    }

    const formatData = res.data?.list.map((each) => {
      return {
        ...each,
        taskStatusID: each?.taskStatusID?._id || each?.taskStatuaID,
      }
    })

    const tasks = convertArrayObjectToObject<Task>(formatData, '_id')

    await dispatch(getTasks(tasks))
    await dispatch(setLoading(false))
  } catch (error) {
    throw error
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
      dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.failCreateTask }))

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
      dispatch(pushNewNotifications({ variant: 'success' , message: NotificationTypes.succeedCreateTask })),
      dispatch(setAssigned('')),
      dispatch(setCurrentStatus('')),
    ])
    await dispatch(setLoading(false))

    return
  } catch (error) {
    await dispatch(
      pushNewNotifications({
        variant: 'error',
        message:
          error?.response?.data?.message || NotificationTypes.failCreateTask,
      }),
    )
    await dispatch(setLoading(false))
    throw error
  }
}

export const updateStatusForTaskByIDThunkAction = (
  taskID: string,
  statusID?: string,
) => async (dispatch, getState) => {
  try {
    const localAccess = localStorage.getItem('access_token')
    const companyID = getState().userInfo.currentCompany._id

    if (!companyID || !taskID || !statusID) {
      return
    }

    const res = await axios({
      data: {
        taskStatusID: statusID,
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

    await dispatch(updateStatusForTask(formatData))

    await dispatch(setLoading(false))
    await dispatch(pushNewNotifications({ variant: 'success' , message: 'updated users assigned for task successfully!' }))
  } catch (error) {
    const errorNotification = returnNotification({ type: 'failed' })
    await dispatch(pushNewNotifications({ variant: 'error' , message: errorNotification['message'] }))
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
      await dispatch(pushNewNotifications({ variant: 'success' , message: NotificationTypes.succedDeleteTask }))

      return
    }

    await Promise.all([
      dispatch(deletedTask(data.taskID)),
      dispatch(removeTasksFfromStatus({ taskID: data.taskID, taskStatusID: data.taskStatusID })),
      dispatch(setLoading(false)),
      dispatch(pushNewNotifications({ variant: 'success' , message: 'Deleted task by taskID successfully!' })),
    ])
  } catch (error) {
    await dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.failDeleteTask }))
    await dispatch(setLoading(false))

    throw error

    return
  }
}

export const updateAssignUserThunkAction = (
  taskID: string,
  assignUserIDs?: string[],
) => async (dispatch, getState) => {
  try {
    const localAccess = localStorage.getItem('access_token')
    const companyID = getState().userInfo.currentCompany._id

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

    await dispatch(updateUserAssigned(formatData))
    await dispatch(setLoading(false))
    await dispatch(pushNewNotifications({ variant: 'success' , message: 'updated users assigned for task successfully!' }))
  } catch (error) {
    const errorNotification = returnNotification({ type: 'failed' })
    await dispatch(pushNewNotifications({ variant: 'error' , message: errorNotification['message'] }))
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

    // const res = await axios.get(`${config.BASE_URL}/companies/${companyID}/tasks/${taskID}`, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    // })

    // await dispatch(getTaskByID(res.data))
    await dispatch(setLoading(false))
  } catch (error) {
    throw error
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
