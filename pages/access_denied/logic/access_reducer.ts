import axios from 'axios';
import { config } from 'helpers/get_config';
import { GetUserAccess } from './access_action';
import { AccessAction } from './access_type_action';

type Token = string | null;
export interface AccessUser {
  _id: string;
  companyID: null;
  departmentID: null;
  status: string;
  userID: string;
  role: string;
  createdBy: string;
}

interface AccessState {
  access: AccessUser[];
}

const initialState: AccessState = {
  access: [],
};

const accessReducer = (state = initialState, action) => {
  switch (action.type) {
    case AccessAction.GET_ACCESS:
      const access = [...action.payload];

      return {
        ...state,
        access,
      };
    default:
      return state;
  }
};

export default accessReducer;

export const getUserAccessAction = () => async (dispatch) => {
  try {
    const token: Token = localStorage.getItem('access_token');

    if (!token) {
      await dispatch(GetUserAccess([]));

      return;
    }

    const userInfo = await axios.get(`${config.BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    await dispatch(GetUserAccess(userInfo?.data?.access ?? []));
  } catch (error) {
    await dispatch(GetUserAccess([]));
    // console.log(error);
  }
};
