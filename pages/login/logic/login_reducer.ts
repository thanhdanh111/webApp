import axios from 'axios';
import { config } from 'helpers/get_config';
import { LoginAction } from './login_type_actions';
import { GetUserData } from './login_actions';

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  status: string;
}

interface ExtendedUser {
  _id: string;
  gender: string;
  userID: string;
}

interface LoginValue {
  value: string;
  userID: string;
  userProfile: Profile | {};
  extendedUser: ExtendedUser | {};
}

const initialState: LoginValue = {
  value: '',
  userID: '',
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

    const res = await axios.get(`${config.LOCAL_HOST}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(GetUserData(res.data));
  } catch (error) {
    throw error;
  }
};
