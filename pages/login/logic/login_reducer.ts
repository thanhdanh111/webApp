import axios from 'axios';
import { config } from 'helpers/get_config';
import { LoginAction } from './login_type_actions';
import { checkIsAdmin } from '../../../helpers/check_is_admin';
import { GetRoles, GetUserData } from './login_actions';

interface ArrayRole {
  name: string;
  roleID: string;
}

interface LoginValue {
  value: string;
  userID: string;
  isAdmin: boolean;
  access: string[];
  roles: ArrayRole[];
  companyID: string;
  departmentID: string;
}

const initialState: LoginValue = {
  value: '',
  userID: '',
  isAdmin: false,
  access: [],
  roles: [],
  companyID: '',
  departmentID: '',
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case LoginAction.LOGIN:
      return {
        ...state,
        value: action.token,
      };
    case LoginAction.LOGOUT:
      return {
        ...state,
        value: '',
      };
    case LoginAction.GET_USER_DATA:
      const isAdmin = checkIsAdmin(action.payload.access);

      return {
        ...state,
        isAdmin,
        companyID: action.payload.companyID,
        userID: action.payload.userID,
        access: action.payload.access,
        departmentID: action.payload.departmentID,
      };
    case LoginAction.GET_ROLES:
      return {
        ...state,
        roles: action.payload,
      };
    default:
      return state;
  }
};

export const GetUserDataThunkAction = (token) => async (dispatch) => {
  try {
    const res = await axios.get(`${config.LOCAL_HOST}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(GetUserData(res.data));
    dispatch(GetRoles(res.data.roles));
  } catch (error) {
    throw error;
  }
};
