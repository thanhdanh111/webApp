import axios from 'axios';
import { hideLoader,  search, showLoader, pagination, hasNoNotification, getNotificationsAction } from './users_actions';
import { UsersData, HeadCell, ParamGetUser, Data, UserAccess } from '../../../helpers/type';
import { config } from 'helpers/get_config';
import { useEffect, useState } from 'react';
import { getDepartmentsName } from '../../../helpers/get_department_name';
import { getRole } from '../../../helpers/get_role';
import { usersAction } from './users_type_action';

export const headCells: HeadCell[] = [
  { id: 'userName', numeric: false, disablePadding: true, label: 'UserName' },
  { id: 'departments', numeric: false, disablePadding: true, label: 'Departments' },
  { id: 'activeRoles', numeric: false, disablePadding: true, label: 'ActiveRoles' },
  { id: 'pendingRoles', numeric: false, disablePadding: true, label: 'PendingRoles' },
  { id: 'action', numeric: false, disablePadding: true, label: 'Action' },
];

export const actionList: string[] = ['Edit', 'Delete'];

const initialState: UsersData = {
  cursor: '',
  list: [],
  listSearch: [],
  notifications: {
    cursor: '',
    list: [],
    totalCount: 0,
    totalUnread: 0,
  },
  hasNoData: false,
  loadingList: true,
  totalCount: 0,
  status: 'string',
  limit: 5,
  limitShowNotification: 10,
};

export const usersReducer = (state = initialState, action) => {
  switch (action.type){
    case usersAction.SHOW_LOADER_LIST:
      return {
        ...state,
        loadingList: true,
      };
    case usersAction.HIDE_LOADER_LIST:
      return {
        ...state,
        loadingList: false,
      };
    case usersAction.PAGINATION:
      const listUser = [...state.list, ...action.payload.list];
      let cursor = action.payload.cursor;

      if (listUser >= action.payload.totalCount) {
        cursor = 'END';
      }

      return {
        ...state,
        cursor,
        totalCount: action.payload.totalCount,
        list: [...state.list, ...action.payload.list],
      };
    case usersAction.SEARCH:
      let newCursor = action.payload.cursor;
      if (action.payload.totalCount <= state.limit) {
        newCursor = 'END';
      }

      return {
        ...state,
        cursor: newCursor,
        totalCount: action.payload.totalCount,
        listSearch: action.payload.list,
      };
    case usersAction.HAS_NO_NOTIFICATION:
      return {
        ...state,
        hasNoData: true,
      };
    case usersAction.GET_NOTIFICATIONS:
      const listNotification = [...state.notifications.list, ...action.payload.list];
      let cursorNotification = action.payload.cursor;

      if (listNotification >= action.payload.totalCount) {
        cursorNotification = 'END';
      }

      return {
        ...state,
        notifications: {
          cursor: cursorNotification,
          list: listNotification,
          totalCount: action.payload.totalCount,
          totalUnread: action.payload.totalUnread,
        },
        hasNoData: true,
      };
    default:
      return state;
  }
};

export const getPaginationThunkAction = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const companyID = '6048780998f1360008f5f883';
    const token = localStorage.getItem('access_token');
    const cursor = state.users.cursor;
    const limit = state.users.limit;

    if (cursor === 'END' || !token || !companyID) {
      return;
    }

    const res =
       await axios.get(`${config.BASE_URL}/userAccesses?companyID=${companyID}&limit=${limit}&cursor=${cursor}`, {
         headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,
         },
       });

    if (res.data.totalCount === 0){
      await dispatch(showLoader());

      return;
    }

    await dispatch(pagination(res.data));
    await dispatch(hideLoader());
  } catch (error) {
    throw error;
  }
};

export const getSearchAction = (fullName) => async (dispatch, getState) => {
  try {
    const state = getState();
    const token = localStorage.getItem('access_token');
    const companyID = '6048780998f1360008f5f883';
    const limit = state.users.limit;

    if (!token || !token.length || !companyID) {
      return;
    }

    const params: ParamGetUser = {
      companyID,
      limit,
      fullName,
    };

    const res =
     await axios.get(`${config.BASE_URL}/userAccesses`, {
       params,
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
       },
     });

    await dispatch(search(res.data));
    await dispatch(hideLoader());
  } catch (error) {
    throw error;
  }
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value]);

  return debouncedValue;
};

function createData(
  id: string,
  userName: string,
  user: UserAccess,
  departments: string[],
  activeRoles: string[],
  pendingRoles: string[],
): Data {
  return { id, userName, user, departments, activeRoles, pendingRoles };
}

export const renderData = (users: UserAccess[]) => {
  return users.map((each: UserAccess) => {
    const departments = getDepartmentsName(each.departmentID);
    const roles = getRole(each.accesses);
    const fullName = `${each.userID.firstName} ${each.userID.lastName}`;
    const id = each.userID._id;
    const user = each;

    return createData(
      id,
      fullName,
      user,
      departments || [],
      roles?.activeRoles || [],
      roles?.pendingRoles || [],
    );
  });
};

export const getNotificationMiddleware = (receiverID) => async (dispatch, getState) => {
  try {
    await dispatch(showLoader());

    const state = getState();
    const token = localStorage.getItem('access_token');
    const cursor = state?.users?.notifications?.cursor;
    const limit = state?.users?.limitShowNotification;

    if (!token || !receiverID) {
      return;
    }

    const res = await axios.get(`${config.BASE_URL}/notifications`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: {
        cursor,
        limit,
        receiverID,
      },
    });

    if (!res.data.totalCount || !res.data.list || !res.data.list.length) {
      await dispatch(hasNoNotification());
      await dispatch(hideLoader());
    }

    await dispatch(getNotificationsAction(res.data));
    await dispatch(hideLoader());
  } catch (error) {
    throw error;
  }
};
