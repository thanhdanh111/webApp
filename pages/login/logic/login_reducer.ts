import axios from 'axios';
import { config } from 'helpers/get_config';
import { LoginAction } from './login_type_actions';
import { GetUserData } from './login_actions';
import { Profile } from 'helpers/type';
import { GetUserAccess } from 'pages/access_denied/logic/access_action';

interface ExtendedUser {
  _id: string;
  gender: string;
  userID: string;
}

interface Access {
  _id: string;
  companyID?: string;
  departmentID?: string;
  status: string;
  userID: string;
  role: string;
}

interface LoginValue {
  value: string;
  userID: string;
  access: Access[] | [];
  userProfile: Profile | {};
  extendedUser: ExtendedUser | {};
}

const initialState: LoginValue = {
  value: '',
  userID: '',
  access: [],
  userProfile: {},
  extendedUser: {},
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
      return {
        ...state,
        userProfile: action.payload.userProfile,
        access: action.payload.access,
        userID: action.payload.userID,
        extendedUser: action.payload.extendedUser,
      };
    default:
      return state;
  }
};

export const GetUserDataThunkAction = (token) => async (dispatch) => {
  try {

    if (!token) {
      return;
    }

    const res = await axios.get(`${config.BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(GetUserData(res.data));
    dispatch(GetUserAccess(res.data?.access ?? []));
  } catch (error) {
    throw error;
  }
};
