import axios from 'axios'
import { updateInviteMembers } from './invite_actions'
import { config } from 'helpers/get_config'
import { pushNewNotifications } from 'redux/common/notifications/reducer'
import { returnNotification } from './invite_error_notifications'
import { Roles } from 'constants/roles'
import { checkValidAccess } from 'helpers/check_valid_access'
import { checkIfEmptyArray } from 'helpers/check_if_empty_array'
type Token = string | null
export enum NotificationTypes{
  error403 = 'You don\'t have permission to invite',
}
export const inviteMembersApi = ({ inviteMembers = [] }) => async (dispatch, getState) => {
  try {
    const companyID = getState()?.userInfo?.currentCompany?._id

    if (!companyID?.length || !inviteMembers?.length) {

      return
    }

    dispatch(updateInviteMembers({ inviteLoading: true }))

    const token: Token =  localStorage.getItem('access_token')
    const res = await axios({
      url: `${config.BASE_URL}/companies/${companyID}/members/invite`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
      data: {
        inviteMembersData: inviteMembers,
      },
    })

    if (res?.data || res?.data?.length) {
      await Promise.all(res.data.map((info) => {
        const errorNotification = returnNotification({ type: info?.status, email: info?.email, message: info?.errorMessage })

        return dispatch(pushNewNotifications({ variant: errorNotification['status'] , message: errorNotification['message'] }))
      }))
    }

    dispatch(updateInviteMembers({ inviteLoading: false }))
  } catch (error) {
    await dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.error403 }))
    await dispatch(updateInviteMembers({ inviteLoading: false }))
  }
}

export const getDepartmentsOfCompany = () => async (dispatch, getState) => {
  try {
    await dispatch(updateInviteMembers({ loading: true }))
    const userInfo = getState()?.userInfo
    const token: Token = localStorage.getItem('access_token')
    const validAccesses = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER]
    const haveAccess = checkValidAccess({ validAccesses, rolesInCompany: userInfo?.rolesInCompany })
    const isAdmin = userInfo?.isAdmin
    let companiesParams = ''

    if (!isAdmin && haveAccess) {
      const companies: string[] = [userInfo?.currentCompany?._id]
      companiesParams = companies.map((companyID: string, index) => `companyID[${index}]=${companyID}`).join('&')
    }

    if (!isAdmin && !companiesParams?.length) {
      await dispatch(updateInviteMembers({ loading: false }))

      return
    }

    const departments = await axios.get(
      `${config.BASE_URL}/departments?${companiesParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    await dispatch(getUserCompaniesApi(departments?.data?.list))
  } catch (error) {
    await dispatch(updateInviteMembers({ loading: false }))
  }
}

const checkValidDepartment = (department) => {
  const invalidDepartment = !department?.name || !department?._id

  return invalidDepartment
}

export const getUserCompaniesApi = (departments) => async (dispatch) => {
  try {
    if (!checkIfEmptyArray(departments)) {
      await dispatch(updateInviteMembers({ loading: false }))

      return
    }

    const newDepartments = departments.map((department) => {
      const inValid = checkValidDepartment(department)

      if (inValid) {
        return
      }

      return {
        departmentID: department?._id,
        name: department?.name,
      }
    })

    await dispatch(updateInviteMembers({
      departments: [
        { departmentID: '', name: 'None' },
        ...newDepartments,
      ],
      loading: false,
    }))
  } catch (error) {
    await dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.error403 }))
    await dispatch(updateInviteMembers({ loading: false }))
  }
}
