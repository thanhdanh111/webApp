import axios from 'axios';
import { hideLoaderListUser,  search, showLoaderListUser, pagination } from './users_actions';
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
  loadingList: true,
  totalCount: 0,
  status: 'string',
  limit: 5,
};

export const usersReducer = (state = initialState, action) => {
  switch (action.type){
    case usersAction.GET_LIST_USERS:
      return {
        ...state,
        list: action.payload.list,
        cursor: action.payload.cursor,
      };
    case usersAction.USER_CURSOR:
      return {
        ...state,
        cursor: action.payload.cursor,
      };
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
       await axios.get(`${config.LOCAL_HOST}/userAccesses?companyID=${companyID}&limit=${limit}&cursor=${cursor}`, {
         headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,
         },
       });

    if (res.data.totalCount === 0){
      await dispatch(showLoaderListUser());

      return;
    }

    await dispatch(pagination(res.data));
    await dispatch(hideLoaderListUser());
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
     await axios.get(`${config.LOCAL_HOST}/userAccesses`, {
       params,
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
       },
     });

    await dispatch(search(res.data));
    await dispatch(hideLoaderListUser());
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
  departments: string[],
  activeRoles: string[],
  pendingRoles: string[],
): Data {
  return { id, userName, departments, activeRoles, pendingRoles };
}

export const renderData = (users: UserAccess[]) => {
  return users.map((each: UserAccess) => {

    const departments = getDepartmentsName(each.departmentID);

    const roles = getRole(each.accesses);

    const fullName = `${each.userID.firstName} ${each.userID.lastName}`;

    const id = each.userID._id;

    return createData(
      id,
      fullName,
      departments || [],
      roles?.activeRoles || [],
      roles?.pendingRoles || [],
    );
  });
};
