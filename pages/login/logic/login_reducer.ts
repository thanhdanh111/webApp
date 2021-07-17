import axios from 'axios'
import { config } from 'helpers/get_config'
import { LoginAction } from './login_type_actions'
import { GetUserData } from './login_actions'
import { UserInfo } from 'helpers/type'
import { getFirstCompanyIDAndDepartmentID, GetFirstCompanyIDAndDepartmentIDType } from 'helpers/get_first_companyid_and_departmentid'
import { checkOnlyTrueInArray } from 'helpers/check_only_true'
import { GetRolesOfLoggedInUser, getRolesOfLoggedInUser } from '../../../helpers/get_roles_of_logged_in_user'

const initialState: UserInfo = {
  token: '',
  userID: '',
  access: [],
  profile: {},
  extendedProfile: {},
  currentCompany: {},
  currentExtendedCompany: {},
  currentDepartment: {},
  rolesInDepartments: {},
  rolesInCompany: [],
  isAdmin: false,
}

export const userInfo = (state = initialState, action) => {
  switch (action.type) {
    case LoginAction.LOGIN:
      return {
        ...state,
        value: action.token,
      }
    case LoginAction.LOGOUT:
      return {
        ...state,
        value: '',
      }
    case LoginAction.GET_USER_DATA:
      return {
        ...state,
        ...action?.payload,
      }
    default:
      return state
  }
}

const GetCurrentCompanyAndDepartmentInfo = async (token, companyID, departmentID) => {
  if (!companyID) {
    return
  }

  const extendedCompany = await axios.get(`${config.BASE_URL}/extendedCompanies/${companyID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const validCompany = checkOnlyTrueInArray({
    conditionsArray: [
      !!extendedCompany?.data?.companyID?.name,
      !!extendedCompany?.data?.companyID?._id,
    ],
  })

  if (!departmentID) {
    return {
      extendedCompany,
      validCompany,
    }
  }

  const department = await axios.get(`${config.BASE_URL}/companies/${companyID}/departments/${departmentID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const validDepartment = checkOnlyTrueInArray({
    conditionsArray: [
      !!department?.data?.name,
      !!department?.data?._id,
    ],
  })

  return {
    validCompany,
    extendedCompany,
    validDepartment,
    department,
  }

}

export const GetUserDataThunkAction = (token) => async (dispatch) => {
  let data
  let res
  try {

    if (!token) {
      return
    }

    res = await axios.get(`${config.BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    const {
      companyID,
      departmentID,
    }: GetFirstCompanyIDAndDepartmentIDType  = getFirstCompanyIDAndDepartmentID({ access: res?.data?.access ?? [] })

    data = res.data

    const isValid = await GetCurrentCompanyAndDepartmentInfo(token, companyID, departmentID)

    data.currentExtendedCompany = isValid?.validCompany ? isValid?.extendedCompany.data : {}
    data.currentDepartment = isValid?.validDepartment ? isValid?.department?.data : {}

    const {
      rolesInCompany,
      rolesInDepartments,
      isAdmin,
    }: GetRolesOfLoggedInUser = getRolesOfLoggedInUser({
      access: res?.data?.access,
      filterCompanyID:  companyID,
    })

    await dispatch(GetUserData({
      isAdmin,
      rolesInCompany,
      rolesInDepartments,
      token,
      access: data?.access,
      userID: data?.userID,
      profile: data?.userProfile,
      extendedProfile: data?.extendedUser,
      currentExtendedCompany: data?.currentExtendedCompany,
      currentCompany: data?.currentExtendedCompany?.companyID,
      currentDepartment: data?.currentDepartment,
    }))
  } catch (error) {
    await dispatch(GetUserData({
      token,
      access: data?.access,
      userID: data?.userID,
      profile: data?.userProfile,
      extendedProfile: data?.extendedUser,
      currentExtendedCompany: data?.currentExtendedCompany,
      currentCompany: data?.currentExtendedCompany?.companyID,
      currentDepartment: data?.currentDepartment,
    }))
  }
}
