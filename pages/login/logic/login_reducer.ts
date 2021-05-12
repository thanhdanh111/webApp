import axios from 'axios';
import { config } from 'helpers/get_config';
import { LoginAction } from './login_type_actions';
import { GetUserData } from './login_actions';
import { LoginValue } from 'helpers/type';
import { getUserCompanies } from 'helpers/get_user_companies';
import { GetUserAccess } from 'pages/access_denied/logic/access_action';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';

const initialState: LoginValue = {
  value: '',
  userID: '',
  access: [],
  userProfile: {},
  extendedUser: {},
  company: {},
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
        company: action?.payload?.company ?? {},
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

    const userCompanies = getUserCompanies({ access: res.data?.access });

    const data = res.data;

    if (userCompanies?.companies && userCompanies?.companies?.length) {
      const company = await axios.get(`${config.BASE_URL}/companies/${userCompanies?.companies[0]}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const validCompany = checkOnlyTrueInArray({
        conditionsArray: [
          !!company?.data?.name,
          !!company?.data?._id,
        ],
      });

      data.company = validCompany ? company.data : {};
    }

    await dispatch(GetUserData(data));
    await dispatch(GetUserAccess(res.data?.access ?? []));
  } catch (error) {
    throw error;
  }
};
