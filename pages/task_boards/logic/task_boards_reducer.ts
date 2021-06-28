import { taskBoardsActionType } from './task_board_action_type';
import { Task, TaskBoard, TaskStatus } from '../../../helpers/type';
import axios from 'axios';
import { config } from 'helpers/get_config';
import {
  setLoading,
  getTasksStatusByID,
  getTaskBoard,
  createdTaskBoard,
  setSelectedTaskBoard,
  getTaskStatus,
  createdTaskStatus,
  setTasksToTaskStatus,
} from './task_boards_action';
import { pushNewNotifications } from 'redux/common/notifications/reducer';
import { returnNotification } from 'pages/invite_members/logic/invite_error_notifications';

export interface TaskBoardsType {
  loading: boolean;
  taskStatus: { [key: string]: TaskStatus };
  currentTaskBoard: TaskBoard;
  taskBoards: TaskBoard[];
  hasNoData: boolean;
  onSendingRequest: boolean;
  filteringTaskByUser: boolean;
}

const initialState: TaskBoardsType = {
  loading: true,
  taskStatus: {},
  currentTaskBoard: {
    _id: '',
    title: '',
  },
  taskBoards: [],
  hasNoData: false,
  onSendingRequest: false,
  filteringTaskByUser: false,
};

interface UpdateTaskStatus {
  taskStatusID: string;
  tasks: Task[];
}

let updatedTaskStatuses: { [key: string]: TaskStatus } = {};

interface UpdateTask {
  taskStatusID: string;
  title?: string;
  description?: string;
  dueDate?: string;
  estimateDate?: string;
  timeTracked?: string;
  priority?: string;
  tagIDs?: string[];
}

interface IUpdateTask {
  taskID: string;
  data: UpdateTask;
  sourceTaskStatusID: string;
  destinationTasks: Task[];
  sourceTasks: Task[];
}

// tslint:disable-next-line: cyclomatic-complexity
export  const taskBoardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case taskBoardsActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case taskBoardsActionType.FILTERING_TASK_BY_USER:
      return {
        ...state,
        filteringTaskByUser: action?.payload,
      };
    case taskBoardsActionType.SET_SELECTED_TASKBOARD:
      return {
        ...state,
        currentTaskBoard: action?.payload?.currentTaskBoard,
      };
    case taskBoardsActionType.GET_TASK_STATUS:
      const taskStatus = {};
      taskStatus[action.payload?._id] = action.payload;

      return {
        ...state,
        taskStatus: { ...state.taskStatus, ...taskStatus },
      };
    case taskBoardsActionType.GET_TASK_BOARD:
      return {
        taskBoards: action?.data?.list,
      };
    case taskBoardsActionType.CREATE_TASK_BOARD:
      return {
        ...state,
        taskBoards: [...state.taskBoards, action?.data],
      };
    case taskBoardsActionType.CREATE_TASK_STATUS:
      const newTAskStatus = {};
      newTAskStatus[action.data?._id] = action.data;

      return {
        ...state,
        currentTaskBoard: {
          ...state.currentTaskBoard,
          taskStatusIDs: [...(state.currentTaskBoard?.taskStatusIDs as string[]), action.data?._id],
        },
        taskStatus: { ...state.taskStatus, ...newTAskStatus },
      };
    case taskBoardsActionType.SET_TASKS_TO_TASK_STATUS:

      updatedTaskStatuses = state.taskStatus;

      let taskStatusUpdated = updatedTaskStatuses[action.data.taskStatusId];

      if (taskStatusUpdated) {
        taskStatusUpdated = {
          ...taskStatusUpdated,
          taskIDs: action?.data.tasks,
        };

        updatedTaskStatuses = {
          ...updatedTaskStatuses,
          [action.data.taskStatusId]: taskStatusUpdated,
        };
      }

      return {
        ...state,
        taskStatus: updatedTaskStatuses,
      };
    default:
      return state;
  }
};

const notificationsType = {
  201: 'Created taskBoard to Company successfully',
  400: 'You have no company right now!',
};

export const getTaskStatusByIDThunkAction = (title, taskStatusID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || !taskStatusID) {
      return;
    }
    // title is targetEntityName
    const res = await axios.get(`${config.BASE_URL}/${title}/${taskStatusID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    if (!res.data) {
      await dispatch(setLoading(false));

      return;
    }

    await dispatch(getTasksStatusByID(res.data));
    await dispatch(setLoading(false));
  } catch (error) {
    throw error;
  }
};

export const getTaskStatusThunkAction = (taskStatusID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || !taskStatusID) {
      return;
    }

    const res = await axios.get(`${config.BASE_URL}/taskStatuses/${taskStatusID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    if (!res.data) {
      await dispatch(setLoading(false));

      return;
    }

    await dispatch(getTaskStatus(res.data));
    await dispatch(setLoading(false));
  } catch (error) {
    throw error;
  }
};

export const getTaskBoardThunkAction = () => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const authState = getState().auth;
    const companyID = authState?.extendedCompany?.companyID?._id;
    const departmentID = authState?.department?._id;

    if (!token || !companyID) {
      return;
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
      });

    if (res.data.totalCount === 0){
      await dispatch(setLoading(false));

      return;
    }

    await dispatch(getTaskBoard(res?.data));
    await dispatch(setSelectedTaskBoard(res?.data?.list[0]));
    await dispatch(setLoading(false));
  } catch (error) {
    throw error;
  }
};

export const createTaskBoardThunkAction = (title, description) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const departmentID = getState().auth?.department?._id;

    if (!token) {
      return;
    }

    await dispatch(setLoading(true));

    const data = {
      title,
      description,
      departmentID,
    };

    const res = await axios.post(`${config.BASE_URL}/taskBoards`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    const notification = notificationsType[res.status];
    await dispatch(createdTaskBoard(res.data));
    await dispatch(setLoading(false));
    await dispatch(pushNewNotifications({ variant: 'success' , message: notification }));
  } catch (error) {
    const notification = notificationsType[error?.response?.status] || 'Something went wrong';
    await dispatch(setLoading(false));
    await dispatch(pushNewNotifications({ variant: 'error' , message: notification }));
  }
};

export const createTaskStatusThunkAction = (title) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const taskBoardID = getState().taskBoards?.currentTaskBoard?._id;

    if (!token || !taskBoardID) {
      return;
    }

    await dispatch(setLoading(true));

    const data = {
      title,
      taskBoardID,
    };

    const res = await axios.post(`${config.BASE_URL}/taskStatuses`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    const notification = notificationsType[res.status];
    await dispatch(createdTaskStatus(res.data));
    await dispatch(setLoading(false));
    await dispatch(pushNewNotifications({ variant: 'success' , message: notification }));
  } catch (error) {
    const notification = notificationsType[error?.response?.status] || 'Something went wrong';
    await dispatch(setLoading(false));
    await dispatch(pushNewNotifications({ variant: 'error' , message: notification }));
  }
};

export const updateTaskStatusById = ({ taskStatusID, tasks }: UpdateTaskStatus) => async (dispatch) => {
  try {
    const localAccess = localStorage.getItem('access_token');
    if (!localAccess || !taskStatusID) {
      return;
    }
    const taskIDs = tasks.map((each) => each._id);

    dispatch(setTasksToTaskStatus({
      tasks,
      taskStatusId: taskStatusID,
    }));

    const res = await axios({
      data: {
        taskIDs,
      },
      url: `${config.BASE_URL}/taskStatuses/${taskStatusID}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localAccess}`,
      },
      method: 'PUT',
    });

    const notification = notificationsType[res.status];
    await dispatch(setLoading(false));
    await dispatch(pushNewNotifications({ variant: 'success' , message: notification }));
  } catch (error) {
    const errorNotification = returnNotification({ type: 'failed' });
    await dispatch(pushNewNotifications({ variant: 'error' , message: errorNotification['message'] }));
  }
};

export const updateTaskById = ({
  taskID,
  data,
  sourceTaskStatusID,
  sourceTasks,
  destinationTasks,
}: IUpdateTask) => async (dispatch, getState) => {
  try {
    const localAccess = localStorage.getItem('access_token');
    const authState = getState().auth;
    const companyID = authState?.extendedCompany?.companyID?._id;

    if (!localAccess || !companyID || !taskID) {
      return;
    }

    dispatch(setTasksToTaskStatus({
      taskStatusId: sourceTaskStatusID,
      tasks: sourceTasks,
    }));
    dispatch(setTasksToTaskStatus({
      taskStatusId: data.taskStatusID,
      tasks: destinationTasks,
    }));

    const res = await axios({
      data,
      url: `${config.BASE_URL}/companies/${companyID}/tasks/${taskID}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localAccess}`,
      },
      method: 'PUT',
    });

    const notification = notificationsType[res.status];
    await dispatch(setLoading(false));
    await dispatch(pushNewNotifications({ variant: 'success' , message: notification }));
  } catch (error) {
    const errorNotification = returnNotification({ type: 'failed' });
    await dispatch(pushNewNotifications({ variant: 'error' , message: errorNotification['message'] }));
  }
};
