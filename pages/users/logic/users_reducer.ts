import axios from 'axios';
import { search, setLoading, pagination, hasNoNotification, getNotificationsAction, updateUnreadNotifications } from './users_actions';
import { UsersData, HeadCell, ParamGetUser, Data, UserAccess, Access } from '../../../helpers/type';
import { config } from 'helpers/get_config';
import { useEffect, useState } from 'react';
import { usersAction } from './users_type_action';
import { rolesRender } from 'constants/roles';
import { getRenderingRolesForUsersPage } from './users_rendering_roles';

export const headCells: HeadCell[] = [
  { id: 'userName', numeric: false, disablePadding: true, label: 'User Name' },
  { id: 'companyRole', numeric: false, disablePadding: true, label: 'Company Role' },
  { id: 'stringPendingRoles', numeric: false, disablePadding: true, label: 'Pending Roles' },
];

export const actionList: string[] = [];

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
  userLimit: 5,
  notificationLimit: 10,
  selectNotification: {
    _id: '',
    isRead: false,
    body: '',
    clickAction: '',
    targetEntityName: '',
    event: '',
    title: '',
    createdAt: '',
    receiverUID: '',
    companyID: '',
    targetID: '',
  },
  editingUserInfo: {},
  onRemovingUser: false,
};

// tslint:disable-next-line: cyclomatic-complexity
export const usersReducer = (state = initialState, action) => {
  switch (action.type){
    case usersAction.SET_LOADING:
      return {
        ...state,
        loadingList: action.payload,
      };
    case usersAction.PAGINATION:
      const listNewUser = renderData(action.payload.list, action.companyID);
      let cursor = action.payload.cursor;

      if (listNewUser?.length >= action.payload.totalCount) {
        cursor = 'END';
      }

      return {
        ...state,
        cursor,
        totalCount: action.payload.totalCount,
        list: [...state.list, ...listNewUser],
      };
    case usersAction.SEARCH:
      let newCursor = action.payload.cursor;
      if (action.payload.totalCount <= state.userLimit) {
        newCursor = 'END';
      }

      return {
        ...state,
        cursor: newCursor,
        totalCount: action.payload.totalCount,
        listSearch: renderData(action.payload.list, action.companyID),
      };
    case usersAction.HAS_NO_NOTIFICATION:
      return {
        ...state,
        hasNoData: true,
      };
    case usersAction.GET_NOTIFICATIONS:
      const listNotification = [...action.payload.list, ...state.notifications.list];
      let cursorNotification = action.payload.cursor;

      if (listNotification >= action.payload.totalCount) {
        cursorNotification = 'END';
      }

      return {
        ...state,
        notifications: {
          cursor: cursorNotification,
          list: [...action.payload.list, ...state.notifications.list],
          totalCount: action.payload.totalCount,
          totalUnread: action.payload.totalUnread,
        },
        hasNoData: true,
      };
    case usersAction.UPDATE_NOTIFICATION:
      return {
        ...state,
        selectNotification: action.payload.selectNotification,
        notifications: {
          ...state.notifications,
          totalUnread: action.payload.totalUnread,
        },
      };
    case usersAction.GET_NOTIFICATIONS_FCM:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          list: [action.payload, ...state.notifications.list],
          totalCount: state.notifications.totalCount + 1,
        },
      };
    case usersAction.UPDATE_USERS_REDUCER:
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};

export const getPaginationThunkAction = () => async (dispatch, getState) => {
  try {
    const authState = getState().auth;
    const token = localStorage.getItem('access_token');
    const cursor = getState().users?.cursor;
    const userLimit = getState().users?.userLimit;
    const companyID = authState?.extendedCompany?.companyID?._id;

    if (cursor === 'END' || !token || !companyID) {
      return;
    }

    const res =
       await axios.get(`${config.BASE_URL}/userAccesses?companyID=${companyID}&limit=${userLimit}&cursor=${cursor}`, {
         headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,
         },
       });

    if (res.data.totalCount === 0){
      await dispatch(setLoading(true));

      return;
    }

    dispatch(pagination(res.data, companyID));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
  }
};

export const getSearchAction = (fullName) => async (dispatch, getState) => {
  try {
    const authState = getState().auth;
    const token = localStorage.getItem('access_token');
    const companyID = authState?.extendedCompany?.companyID?._id;

    if (!token || !companyID) {
      return;
    }

    await dispatch(setLoading(true));

    const params: ParamGetUser = {
      companyID,
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

    await dispatch(search(res.data, companyID));
    await dispatch(setLoading(false));
  } catch (error) {
    await dispatch(setLoading(false));
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
  companyRole: string,
  departmentRoles: Access[],
  stringPendingRoles: string[],
): Data {
  return { id, userName, user, departmentRoles, companyRole, stringPendingRoles };
}

export const renderData = (users: UserAccess[], companyID) => {
  return users.map((user: UserAccess) => {
    const roles = getRenderingRolesForUsersPage(user.accesses, companyID);
    const fullName = `${user.userID.firstName} ${user.userID.lastName}`;
    const id = user.userID._id;

    return createData(
      id,
      fullName,
      user,
      rolesRender[roles?.companyRole?.role],
      roles?.departmentRoles || [],
      roles?.stringPendingRoles || [],
    );
  });
};

export const getNotificationMiddleware = () => async (dispatch, getState) => {
  try {
    const authState = getState().auth;
    const receiverID = authState?.userID;
    const token = localStorage.getItem('access_token');
    const cursor = getState()?.users?.notifications?.cursor;
    const notificationLimit = getState()?.users?.notificationLimit;

    if (!token || !receiverID || cursor === 'END') {
      return;
    }

    const res = await axios.get(`${config.BASE_URL}/notifications`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: {
        cursor,
        receiverID,
        limit: notificationLimit,
      },
    });

    if (!res.data.totalCount || !res.data.list || !res.data.list.length) {
      await dispatch(hasNoNotification());
      await dispatch(setLoading(false));

      return;
    }

    await dispatch(getNotificationsAction(res.data));
    await dispatch(setLoading(false));
  } catch (error) {
    await dispatch(setLoading(false));
  }
};

export const updateUnreadNotificationMiddleware = (notificationID: string, isRead: boolean) => async (dispatch, getState) => {
  try {
    const state = getState();
    const token = localStorage.getItem('access_token');

    if (!token || !notificationID) {
      return;
    }

    const res = await axios.put(`${config.BASE_URL}/notifications/${notificationID}`,
      {
        isRead,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const resultUpdateUnreadNotification = {
      selectNotification: res.data,
      totalUnread: state?.notifications?.totalUnread - 1,
    };

    dispatch(updateUnreadNotifications(resultUpdateUnreadNotification));
  } catch (error) {
    throw error;
  }
};
