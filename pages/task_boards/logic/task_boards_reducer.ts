import { taskBoardsActionType } from './task_board_action_type'
import { Task, TaskBoard, TaskStatus } from '../../../helpers/type'
import axios from 'axios'
import { config } from 'helpers/get_config'
import {
  setLoading,
  getTaskBoard,
  createdTaskBoard,
  setSelectedTaskBoard,
} from './task_boards_action'
import { pushNewNotifications } from 'redux/common/notifications/reducer'
import { returnNotification } from 'pages/invite_members/logic/invite_error_notifications'

export interface TaskBoardsType {
  loading: boolean
  taskStatus: TaskStatus[]
  currentTaskBoard: TaskBoard
  taskBoards: TaskBoard[]
  hasNoData: boolean
  onSendingRequest: boolean
}

export enum NotificationTypes {
  failCreateTask = 'Failed Create Task',
  succeedCreateTask = 'Create Task Successfully',
  failCreateTag = 'Failed Create Tag',
  failDeleteTag = 'Failed Delete Tag',
}

const initialState: TaskBoardsType = {
  loading: true,
  taskStatus: [],
  currentTaskBoard: {
    _id: '',
    title: '',
  },
  taskBoards: [],
  hasNoData: false,
  onSendingRequest: false,
}

// interface UpdateTaskStatus {
//   taskStatusID: string
//   tasks: Task[]
// }

let updatedTaskStatuses: TaskStatus[] = []

interface UpdateTask {
  taskStatusID: string
  title?: string
  description?: string
  dueDate?: string
  estimateDate?: string
  timeTracked?: string
  priority?: string
  tagIDs?: string[]
  newIndex?: number
}

interface IUpdateTask {
  taskID: string
  data: UpdateTask
  sourceTaskStatusID: string
  destinationTasks: Task[]
  sourceTasks: Task[]
}

// tslint:disable-next-line: cyclomatic-complexity
export  const taskBoardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case taskBoardsActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case taskBoardsActionType.SET_SELECTED_TASKBOARD:
      return {
        ...state,
        currentTaskBoard: action?.payload?.currentTaskBoard,
      }
    case taskBoardsActionType.GET_TASK_BOARD:
      return {
        ...state,
        taskBoards: action?.data?.list,
      }
    case taskBoardsActionType.CREATE_TASK_BOARD:
      return {
        ...state,
        taskBoards: [...state.taskBoards, action?.data],
      }
    case taskBoardsActionType.CREATE_TASK_STATUS:
      const newTaskStatus = action.data
      const statusesAfterCreate = state?.currentTaskBoard?.taskStatusIDs?.push(newTaskStatus)

      return {
        ...state,
        currentTaskBoard: {
          ...state.currentTaskBoard,
          taskStatusIDs: statusesAfterCreate,
        },
      }
    case taskBoardsActionType.DELETE_TASK_STATUS:
      updatedTaskStatuses = state.taskStatus
      const deleteStatusID = action?.payload
      const updateStatusInTaskBoard = state?.currentTaskBoard?.taskStatusIDs?.filter((statusID) => statusID !== deleteStatusID)

      return {
        ...state,
        currentTaskBoard: {
          ...state.currentTaskBoard,
          taskStatusIDs: updateStatusInTaskBoard,
        },
      }
    case taskBoardsActionType.SET_TEMPLATE_TITLE_STATUS:
      return {
        ...state,
        templateTitleStatus: action?.payload,
      }
    case taskBoardsActionType.RENAME_TASK_STATUS:
      if (action.payload?._id) {
        updatedTaskStatuses = {
          ...updatedTaskStatuses,
          [action.payload?._id]: action.payload,
        }
      }

      return {
        ...state,
        taskStatus: updatedTaskStatuses,
      }
    case taskBoardsActionType.HAS_NO_DATA:
      return {
        ...state,
        hasNoData: action?.payload,
      }
    case taskBoardsActionType.SET_TASKS_TO_STATUS:
      const upsatedStatusesAfterAddTask = state?.currentTaskBoard?.taskStatusIDs?.map((each) => {
        if (each?._id !== action.payload.taskStatusID) {
          return
        }

        return {
          ...each,
          taskIDs: [...each?.taskIDs, action?.data?.tasks?._id],
        }
      })

      return {
        ...state,
        currentTaskBoard: {
          ...state.currentTaskBoard,
          taskStatusIDs: upsatedStatusesAfterAddTask,
        },
      }
    case taskBoardsActionType.REMOVE_TASK_FROM_STATUS:
      const upsatedStatusesAfterDeleteTask = state?.currentTaskBoard?.taskStatusIDs?.map((each) => {
        if (each?._id !== action.payload.taskStatusID) {
          return
        }

        const temporaryTaskIDs = each?.taskIDs?.filter((task) => task !== action.payload?.taskID)

        return {
          ...each,
          taskIDs: temporaryTaskIDs,
        }
      })

      return {
        ...state,
        currentTaskBoard: {
          ...state.currentTaskBoard,
          taskStatusIDs: upsatedStatusesAfterDeleteTask,
        },
      }
    default:
      return state
  }
}

const notificationsType = {
  201: 'Created taskBoard to Company successfully',
  400: 'You have no taskBoard right now!',
}

export const getTaskBoardThunkAction = () => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const userInfo = getState().userInfo
    const companyID = userInfo.currentCompany?._id
    const departmentID = userInfo?.currentDepartment?._id

    if (!token || !companyID) {
      return
    }

    const res = await axios.get(`${config.BASE_URL}/taskBoards`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          companyID,
          departmentID,
        },
      })

    if (res.data.totalCount === 0){
      await dispatch(setLoading(false))

      return
    }

    await dispatch(getTaskBoard(res?.data))
    await dispatch(setSelectedTaskBoard(res?.data?.list[0]))
    await dispatch(setLoading(false))
  } catch (error) {
    throw error
  }
}

export const createTaskBoardThunkAction = (title, description) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const userInfo = getState().userInfo
    const departmentID = userInfo?.currentDepartment?._id

    if (!token) {
      return
    }

    await dispatch(setLoading(true))

    const data = {
      title,
      description,
      departmentID,
    }

    const res = await axios.post(`${config.BASE_URL}/taskBoards`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

    const notification = notificationsType[res.status]
    await dispatch(createdTaskBoard(res.data))
    await dispatch(setLoading(false))
    await dispatch(pushNewNotifications({ variant: 'success' , message: notification }))
  } catch (error) {
    const notification = notificationsType[error?.response?.status] || 'Something went wrong'
    await dispatch(setLoading(false))
    await dispatch(pushNewNotifications({ variant: 'error' , message: notification }))
  }
}

// drag drop
export const updateTaskById = ({
  taskID,
  data,
  // sourceTaskStatusID,
  // sourceTasks,
  // destinationTasks,
}: IUpdateTask) => async (dispatch, getState) => {
  try {
    const localAccess = localStorage.getItem('access_token')
    const companyID = getState().userInfo.currentCompany._id

    if (!localAccess || !companyID || !taskID) {
      return
    }

    // dispatch(setTasksToTaskStatus({
    //   taskStatusId: sourceTaskStatusID,
    //   tasks: sourceTasks,
    // }))
    // dispatch(setTasksToTaskStatus({
    //   taskStatusId: data.taskStatusID,
    //   tasks: destinationTasks,
    // }))

    const res = await axios({
      data,
      url: `${config.BASE_URL}/companies/${companyID}/tasks/${taskID}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localAccess}`,
      },
      method: 'PUT',
    })

    const notification = notificationsType[res.status]
    await dispatch(setLoading(false))
    await dispatch(pushNewNotifications({ variant: 'success' , message: notification }))
  } catch (error) {
    const errorNotification = returnNotification({ type: 'failed' })
    await dispatch(pushNewNotifications({ variant: 'error' , message: errorNotification['message'] }))
  }
}
