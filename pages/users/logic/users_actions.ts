import { usersAction } from './users_type_action';

export const getListUsers = (res: object) => {
  return {
    type: usersAction.GET_LIST_USERS,
    payload: res,
  };
};

export const userCursor = (res: string) => {
  return {
    type: usersAction.USER_CURSOR,
    payload: res,
  };
};

export const showLoaderListUser = () => {
  return {
    type: usersAction.SHOW_LOADER_LIST,
  };
};

export const hideLoaderListUser = () => {
  return {
    type: usersAction.HIDE_LOADER_LIST,
  };
};

export const pagination = (res: object) => {
  return{
    type: usersAction.PAGINATION,
    payload: res,
  };
};

export const search = (res: object) => {
  return{
    type: usersAction.SEARCH,
    payload: res,
  };
};
