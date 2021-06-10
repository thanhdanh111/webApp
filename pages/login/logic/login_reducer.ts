import axios from 'axios';
import { config } from 'helpers/get_config';
import { LoginAction } from './login_type_actions';
import { GetUserData } from './login_actions';
import { LoginValue } from 'helpers/type';
import { getUserCompanyIDsAndDepartmentIDs, GetUserCompanyIDsAndDepartmentIDsType } from 'helpers/get_user_companyIDs_departmentIDs';
import { GetUserAccess } from 'pages/access_denied/logic/access_action';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';
import { checkArray } from 'helpers/check_array';

const initialState: LoginValue = {
  value: '',
  userID: '',
  access: [],
  userProfile: {},
  extendedUser: {},
  extendedCompany: {},
  department: {},
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
        userProfile: action.payload?.userProfile,
        access: action?.payload?.access,
        userID: action?.payload?.userID,
        extendedUser: action?.payload?.extendedUser,
        extendedCompany: action?.payload?.extendedCompany ?? {},
        department: action?.payload?.department ?? {},
      };
    default:
      return state;
  }
};

export const GetUserDataThunkAction = (token) => async (dispatch) => {
  let data;
  let res;

  try {
    if (!token) {
      return;
    }

    res = await axios.get(`${config.BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const {
      companyIDsOfDepartmentIDs,
      departmentIDs,
      companyIDs,
    }: GetUserCompanyIDsAndDepartmentIDsType = getUserCompanyIDsAndDepartmentIDs({ access: res.data?.access });

    const checkUserCompanies = checkArray(companyIDsOfDepartmentIDs) || checkArray(companyIDs);
    const checkUserDepartments = checkArray(companyIDsOfDepartmentIDs) && checkArray(departmentIDs);

    data = res.data;

    if (checkUserCompanies) {
      const extendedCompany = await axios.get(`${config.BASE_URL}/extendedCompanies/${companyIDsOfDepartmentIDs?.[0] ?? companyIDs?.[0]}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const validCompany = checkOnlyTrueInArray({
        conditionsArray: [
          !!extendedCompany?.data?.companyID?.name,
          !!extendedCompany?.data?.companyID?._id,
        ],
      });

      data.extendedCompany = validCompany ? extendedCompany.data : {};
    }

    if (checkUserDepartments) {
      const department = await axios.get(`${config.BASE_URL}/companies/${companyIDsOfDepartmentIDs?.[0]}/departments/${departmentIDs?.[0]}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const validDepartment = checkOnlyTrueInArray({
        conditionsArray: [
          !!department?.data?.name,
          !!department?.data?._id,
        ],
      });

      data.department = validDepartment ? department.data : {};
    }

    await dispatch(GetUserData(data));
    await dispatch(GetUserAccess(res?.data?.access ?? []));
  } catch (error) {
    await dispatch(GetUserData(data));
    await dispatch(GetUserAccess(res?.data?.access ?? []));
  }
};
