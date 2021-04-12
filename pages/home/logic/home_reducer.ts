import { dashboardClickUp } from './home_type';
import { TaskStatusType } from '../../../helpers/type';
import axios from 'axios';
import { config } from 'helpers/get_config';
import { getDataTaskStatuses, hideLoaderListUser } from './home_actions';

interface Data {
  loading: boolean;
  totalCount: number;
  cursor: string;
  list: TaskStatusType[];
  limit: number;
}

const initialState: Data = {
  loading: true,
  totalCount: 0,
  cursor: '',
  list: [],
  limit: 5,
};

export  const taskStatusesReducer = (state = initialState, action) => {
  switch (action.type) {
    case dashboardClickUp.SHOW_LOADER_LIST:
      return {
        ...state,
        loading: true,
      };
    case dashboardClickUp.HIDE_LOADER_LIST:
      return {
        ...state,
        loading: false,
      };
    case dashboardClickUp.GET_TASK_STATUSES:
      return {
        ...state,
        cursor: action.payload.cursor,
        totalCount: action.payload.totalCount,
        list: action.payload.list,
      };
    default:
      return state;
  }
};

export const getTaskStatusThunkAction = (companyID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || !companyID) {
      await dispatch(hideLoaderListUser());

      return;
    }

    const res = await axios.get(`${config.BASE_URL}/taskStatuses`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          companyID,
        },
      });

    if (res.data.totalCount === 0){
      await dispatch(hideLoaderListUser());

      return;
    }

    await dispatch(getDataTaskStatuses(res.data));
    await dispatch(hideLoaderListUser());

  } catch (error) {
    throw error;
  }
};
