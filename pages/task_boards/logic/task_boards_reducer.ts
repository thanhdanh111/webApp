import { taskBoardsActionType } from './task_board_action_type';
import { Tag, Task, TaskBoard, TaskStatus, User } from '../../../helpers/type';
import axios from 'axios';
import { config } from 'helpers/get_config';
import {
  setLoading,
  getTaskBoard,
  createdTaskBoard,
  setSelectedTaskBoard,
  getTaskStatus,
  createdTaskStatus,
  addTask,
  setTasksToTaskStatus,
  getTaskDetail,
  getTag,
  createTag,
  updateTag,
  deleteTag,
  updateUserAssigned,
  deletedTaskStatus,
  renameTaskStatus,
  searchTaskByTitle,
} from './task_boards_action';
import { pushNewNotifications } from 'redux/common/notifications/reducer';
import { returnNotification } from 'pages/invite_members/logic/invite_error_notifications';
import { checkIfEmptyArray } from 'helpers/check_if_empty_array';
import { checkHasObjectByKey } from 'helpers/check_in_array';

export interface TaskBoardsType {
  loading: boolean;
  taskStatus: { [key: string]: TaskStatus };
  currentTaskBoard: TaskBoard;
  taskBoards: TaskBoard[];
  hasNoData: boolean;
  onSendingRequest: boolean;
  filteringTaskByUser: boolean;
  currentTaskStatus: string;
  newTask: Task;
  usersAssigned: User[];
  taskDetail: Task;
  tags: Tag[];
  templateTitleStatus?: string;
  filterResultTasks: Task[];
  isFiltering: boolean;
  cursorTag: string;
  totalCountTag: number;
}

export enum NotificationTypes {
  failCreateTask = 'Failed Create Task',
  succeedCreateTask = 'Create Task Successfully',
  failCreateTag = 'Failed Create Tag',
  failDeleteTag = 'Failed Delete Tag',
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
  currentTaskStatus: '',
  newTask: {
    title: '',
    _id: '',
    taskStatusID: {
      _id: '',
      taskBoardID: '',
      taskIDs: [],
      title: '',
    },
  },
  usersAssigned: [],
  taskDetail: {
    title: '',
    _id: '',
    taskStatusID: {
      _id: '',
      taskBoardID: '',
      taskIDs: [],
      title: '',
    },
  },
  tags: [],
  templateTitleStatus: '',
  filterResultTasks: [],
  isFiltering: false,
  cursorTag: '',
  totalCountTag: 0,
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
  newIndex?: number;
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
        ...state,
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
    case taskBoardsActionType.ADD_TASK:
      const taskStatusTemp = { ...state.taskStatus };
      taskStatusTemp[action.payload.taskStatusID]?.taskIDs.unshift(action.payload);

      return {
        ...state,
        taskStatus: { ...taskStatusTemp },
        currentTaskStatus: '',
        usersAssigned: [],
      };
    case taskBoardsActionType.SET_TYPE_CREATE_TASK:
      if (state.currentTaskStatus === action.payload){
        return { ...state };
      }

      return {
        ...state,
        currentTaskStatus: action.payload,
        newTask: { title: '' },
        usersAssigned: [],
      };
    case taskBoardsActionType.UPDATE_NEW_TASK:
      return {
        ...state,
        newTask: { ...action.payload },
      };
    case taskBoardsActionType.ASSIGN_USER:

      return {
        ...state,
        usersAssigned: [...state.usersAssigned, action.payload],
      };
    case taskBoardsActionType.UNASSIGN_USER:
      return {
        ...state,
        usersAssigned: state.usersAssigned.filter((user) => action.payload !== user._id),
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
    case taskBoardsActionType.GET_TASK_DETAIL:
      return {
        ...state,
        taskDetail: { ...action.payload },
      };
    case taskBoardsActionType.GET_TAG:
      return {
        ...state,
        tags: action.payload.data,
        cursorTag: action.payload.cursor,
        totalCountTag: action.payload.totalCount,
      };
    case taskBoardsActionType.CREATE_TAG:
      return {
        ...state,
        tags: [...state.tags, action.payload],
      };
    case taskBoardsActionType.UPDATE_TAG:
      const tags = state.tags;
      const indexTag = tags.findIndex((tag) => tag._id === action.payload._id);
      tags[indexTag] = action.payload;
      const taskStatuses = { ...state.taskStatus };
      if (taskStatuses !== {}){
        Object.keys(taskStatuses).map((statusKey) => {
          if (taskStatuses[statusKey] || taskStatuses[statusKey].taskIDs){
            return;
          }
          const tasks = taskStatuses[statusKey].taskIDs;
          tasks.map((task, key) => {
            if (!task.tagIDs){
              return;
            }
            const listTags = task.tagIDs;
            listTags.map((tagTask, index) => {
              if (tagTask._id !== action.payload._id) {
                return;
              }
              listTags[index] = action.payload;
            });
            tasks[key].tagIDs = listTags;
          });
          taskStatuses[statusKey].taskIDs = tasks;
        });
      }
      const taskDetail = { ...state.taskDetail };
      if (taskDetail?.tagIDs){
        const tagIndex = taskDetail?.tagIDs.findIndex((tag) => tag?._id === action.payload._id);
        if (tagIndex >= 0){
          taskDetail.tagIDs[tagIndex] = action.payload;
        }
      }

      return {
        ...state,
        tags,
        taskStatus: taskStatuses,
        taskDetail: { ...taskDetail },
      };
    case taskBoardsActionType.DELETE_TAG:
      if (state.taskDetail?.tagIDs && checkHasObjectByKey(state.taskDetail.tagIDs || [], action.payload, '_id')) {

        return {
          ...state,
          tags: state.tags.filter((tag) => action.payload !== tag._id),
          taskDetail: { ...state.taskDetail, tagIDs: state.taskDetail?.tagIDs.filter((tag) => action.payload !== tag._id) },
        };
      }

      return {
        ...state,
        tags: state.tags.filter((tag) => action.payload !== tag._id),
      };
    case taskBoardsActionType.DELETE_TASK_STATUS:
      updatedTaskStatuses = state.taskStatus;
      const deleteStatusID = action?.payload;
      const status = delete updatedTaskStatuses?.[deleteStatusID];

      if (!status) {
        return;
      }

      const updateStatusInTaskBoard = state?.currentTaskBoard?.taskStatusIDs?.filter((statusID) => statusID !== deleteStatusID);

      return {
        ...state,
        taskStatus: updatedTaskStatuses,
        currentTaskBoard: {
          ...state.currentTaskBoard,
          taskStatusIDs: updateStatusInTaskBoard,
        },
      };
    case taskBoardsActionType.SET_TEMPLATE_TITLE_STATUS:
      return {
        ...state,
        templateTitleStatus: action?.payload,
      };
    case taskBoardsActionType.RENAME_TASK_STATUS:
      if (action.payload?._id) {
        updatedTaskStatuses = {
          ...updatedTaskStatuses,
          [action.payload?._id]: action.payload,
        };
      }

      return {
        ...state,
        taskStatus: updatedTaskStatuses,
      };

      // filter task
    case taskBoardsActionType.HAS_NO_DATA:
      return {
        ...state,
        hasNoData: action?.payload,
      };
    case taskBoardsActionType.SEARCH_TASKS_BY_TITLE:

      return {
        ...state,
        filterResultTasks: action.payload,
      };
    case taskBoardsActionType.SET_FILTERING:
      return {
        ...state,
        isFiltering: action.payload,
      };
    case taskBoardsActionType.UPDATE_USER_ASSIGN_FOR_TASK:
      updatedTaskStatuses = state.taskStatus;

      let statusUpdated = updatedTaskStatuses[action?.payload?.taskStatusID?._id];
      const tasksUpdated = statusUpdated?.taskIDs?.map((task) => {
        if (task?._id === action?.payload?._id) {
          return action.payload;
        }

        return task;
      });

      if (statusUpdated) {
        statusUpdated = {
          ...statusUpdated,
          taskIDs: tasksUpdated,
        };

        updatedTaskStatuses = {
          ...updatedTaskStatuses,
          [action?.payload?.taskStatusID?._id]: statusUpdated,
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
  400: 'You have no taskBoard right now!',
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
    const userInfo = getState().userInfo;
    const companyID = userInfo.currentCompany._id;
    const departmentID = userInfo?.currentDepartment?._id;

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
    const userInfo = getState().userInfo;
    const departmentID = userInfo?.currentDepartment?._id;

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

export const addTaskThunkAction = (companyID) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token || !companyID) {
      dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.failCreateTask }));

      return;
    }
    const res = await axios.post(`${config.BASE_URL}/companies/${companyID}/tasks`,
    getState().taskBoards.newTask,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    dispatch(addTask(res.data));
    dispatch(pushNewNotifications({ variant: 'success' , message: NotificationTypes.succeedCreateTask }));
  } catch (error) {
    dispatch(
      pushNewNotifications({
        variant: 'error',
        message:
          error?.response?.data?.message || NotificationTypes.failCreateTask,
      }),
    );
    throw error;
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
    const companyID = getState().userInfo.currentCompany._id;

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

export const getTaskByIdThunkAction = (taskID) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const companyID = getState()?.userInfo?.currentCompany?._id;
    if (!token || !companyID) {
      dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.failCreateTask }));

      return false;
    }
    const res = await axios.get(`${config.BASE_URL}/companies/${companyID}/tasks/${taskID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    dispatch(getTaskDetail(res.data));

    return true;
  } catch (error) {
    throw error;
  }
};

export const getTagsThunkAction = (searchTag, isNewSearchTag) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const companyID = getState()?.userInfo?.currentCompany?._id;
    if (!token || !companyID) {
      return;
    }
    let cursor = '';
    let tags = [];

    if (!isNewSearchTag) {
      cursor = getState()?.taskBoards.cursorTag;
      if (cursor === 'END'){
        return;
      }
      tags = getState()?.taskBoards.tags;
    }

    const res = await axios.get(`${config.BASE_URL}/tags`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          cursor,
          companyID,
          limit: 10,
          name: searchTag,
        },
      });

    dispatch(getTag({ data: [...tags, ...res.data.list], cursor: res.data.cursor, totalCount : res.data.totalCount }));
  } catch (error) {
    throw error;
  }
};

export const createTagThunkAction = (tag) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const companyID = getState()?.userInfo?.currentCompany?._id;
    const departmentID = getState()?.userInfo?.currentDepartment?._id;
    if (!token || !companyID) {
      return;
    }
    const res = await axios.post(`${config.BASE_URL}/companies/${companyID}/tags`,
      { ...tag, departmentID },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    dispatch(createTag(res.data));

  } catch (error) {
    dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.failCreateTag }));
    throw error;
  }
};

export const updateTagThunkAction = (tagID, dataUpdateTag) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const companyID = getState()?.userInfo?.currentCompany?._id;
    if (!token || !companyID) {
      return;
    }
    const res = await axios.put(`${config.BASE_URL}/companies/${companyID}/tags/${tagID}`,
    dataUpdateTag,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    dispatch(updateTag(res.data));
  } catch (error) {
    throw error;
  }
};

export const deleteTagThunkAction = (id) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const companyID = getState()?.userInfo?.currentCompany?._id;
    if (!token || !companyID) {
      return;
    }
    const res = await axios.delete(`${config.BASE_URL}/companies/${companyID}/tags/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    if (res.data?.isDeleted){
      dispatch(deleteTag(id));
    }
  } catch (error) {
    dispatch(
      pushNewNotifications({
        variant: 'error',
        message:
          error?.response?.data?.message || NotificationTypes.failDeleteTag,
      }),
    );
    throw error;
  }
};

export const deletedTaskStatusThunkAction = (taskStatusID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || !taskStatusID) {
      return;
    }

    const res = await axios({
      url: `${config.BASE_URL}/taskStatuses/${taskStatusID}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
    });

    if (!res.data) {
      await dispatch(pushNewNotifications({ variant: 'error' , message: 'delete status unsuccess!' }));

      return;
    }

    await dispatch(deletedTaskStatus(taskStatusID));
    await dispatch(pushNewNotifications({ variant: 'success' , message: 'delete status successfully!' }));
  } catch (error) {
    const notification = notificationsType[error?.response?.status] || 'Something went wrong';
    await dispatch(pushNewNotifications({ variant: 'error' , message: notification }));
  }
};

export const renameTaskStatusThunkAction = (taskStatusID) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const reTitleStatus = getState().taskBoards.templateTitleStatus;

    if (!token || !reTitleStatus?.length || !taskStatusID) {
      return;
    }

    const res = await axios({
      url: `${config.BASE_URL}/taskStatuses/${taskStatusID}`,
      data: {
        title: reTitleStatus,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
    });

    await dispatch(renameTaskStatus(res.data));
    await dispatch(pushNewNotifications({ variant: 'success' , message: 'rename status successfully!' }));
  } catch (error) {
    const notification = notificationsType[error?.response?.status] || 'Something went wrong';
    await dispatch(pushNewNotifications({ variant: 'error' , message: notification }));
  }
};

export const deletedTaskThunkAction = (taskID: Task) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const userInfo = getState()?.userInfo;
    const taskStatuses: { [key: string]: TaskStatus } = getState()?.taskBoards?.taskStatus;
    const companyID = userInfo?.currentCompany?._id;

    if (!token || !taskID || !companyID) {
      return;
    }

    await axios({
      url: `${config.BASE_URL}/companies/${companyID}/tasks/${taskID?._id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
    });

    const taskStatus = taskID?.taskStatusID?._id as string;
    const listTasks: Task[] = taskStatus ?
    taskStatuses[taskStatus]?.taskIDs?.filter((item) => item?._id !== taskID?._id) : [];

    await dispatch(updateTaskStatusById({ taskStatusID: taskStatus, tasks: listTasks }));
    await dispatch(setLoading(false));
    await dispatch(pushNewNotifications({ variant: 'success' , message: 'Deleted task by taskID successfully!' }));
  } catch (error) {
    const errorNotification = returnNotification({ type: 'failed' });
    await dispatch(pushNewNotifications({ variant: 'error' , message: errorNotification['message'] }));

  }
};

// filter tasks
export const searchTasksByTitleThunkAction = (title: string) => async (dispatch, getState) => {
  try {
    await dispatch(setLoading(true));
    const token = localStorage.getItem('access_token');
    const userInfo = getState().userInfo;
    const companyID = userInfo.currentCompany._id;

    if (!token || !title?.length) {
      return;
    }

    const res = await axios.get(`${config.BASE_URL}/tasks`, {
      params: {
        title,
        companyID,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (checkIfEmptyArray(!res?.data?.list)) {
      await dispatch(setLoading(false));

      return;
    }

    await dispatch(searchTaskByTitle(res.data.list));
    await dispatch(setLoading(false));
  } catch (error) {
    throw error;
  }
};

export const updateAssignUserThunkAction = (
  taskID: string,
  assignUserIDs?: string[],
) => async (dispatch, getState) => {
  try {
    const localAccess = localStorage.getItem('access_token');
    const companyID = getState().userInfo.currentCompany._id;

    if (!companyID || !taskID) {
      return;
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
    });

    await dispatch(updateUserAssigned(res?.data));
    const notification = notificationsType[res.status];
    await dispatch(setLoading(false));
    await dispatch(pushNewNotifications({ variant: 'success' , message: notification }));
  } catch (error) {
    const errorNotification = returnNotification({ type: 'failed' });
    await dispatch(pushNewNotifications({ variant: 'error' , message: errorNotification['message'] }));
  }
};

export const updateTaskThunkAction = (taskID, dataUpdateTask) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const companyID = getState()?.userInfo?.currentCompany?._id;
    if (!token || !companyID) {
      return;
    }
    const res = await axios.put(`${config.BASE_URL}/companies/${companyID}/tasks/${taskID}`,
      dataUpdateTask,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    if (taskID === getState()?.taskBoards?.taskDetail?._id) {
      dispatch(getTaskDetail(res.data));
    }
    // dispatch(updateTaskInStatus(res.data));
  } catch (error) {
    throw error;
  }
};
