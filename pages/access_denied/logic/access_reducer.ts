import axios from 'axios';
import { Roles } from 'constants/roles';
import { config } from 'helpers/get_config';
import { GetRolesOfLoggedInUser, getRolesOfLoggedInUser, RolesInDepartments } from 'helpers/get_roles_of_logged_in_user';
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
  rolesInCompany: Roles[];
  rolesInDepartments: RolesInDepartments;
  isAdmin: boolean;
}

const initialState: AccessState = {
  access: [],
  rolesInCompany: [],
  rolesInDepartments: {},
  isAdmin: false,
};

const accessReducer = (state = initialState, action) => {
  switch (action.type) {
    case AccessAction.GET_ACCESS:

      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default accessReducer;

export const getUserAccessAction = () => async (dispatch, getState) => {
  try {
    const token: Token = localStorage.getItem('access_token');
    const authState = getState()?.auth;

    if (!token) {
      dispatch(GetUserAccess({ access: [] }));

      return;
    }

    const userInfo = await axios.get(`${config.BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const {
      rolesInCompany,
      rolesInDepartments,
      isAdmin,
    }: GetRolesOfLoggedInUser = getRolesOfLoggedInUser({
      accesses: userInfo?.data?.access,
      filterCompanyID:  authState?.extendedCompany?.companyID?._id,
    });

    dispatch(GetUserAccess({ isAdmin, rolesInCompany, rolesInDepartments, access: userInfo?.data?.access ?? [] }));
  } catch (error) {
    dispatch(GetUserAccess({ access: [] }));
  }
};
