import axios from 'axios'
import { config } from 'helpers/get_config'
import { RolesInDepartments, Token } from 'helpers/type'
import {
  updatePaginationTimeOff, updateTimeOffIndexLoading,
  updateStatusTimeOff, updateTimeOffLoadingStatus,
  updateOnSendingTimeOffRequest, updateTimeOffCompaniesToRequest, updateTimeOffsReducer,
  updateTimeOffRequestReducer,
  getTimeOffByID,
} from './time_off_actions'
import { SelectedTimeOffDataType, TimeOffModel, TimeOffRequestProps, TimeOffValue } from './time_off_interface'
import moment from 'moment'
import { getDepartmentsIntoCompanies } from 'helpers/get_the_departments_into_companies'
import { checkOnlyTrueInArray } from 'helpers/check_only_true'
import { pushNewNotifications } from 'redux/common/notifications/reducer'
import { dateTimeUiFormat } from 'constants/date_time_ui_format'
import { checkValidAccess } from 'helpers/check_valid_access'
import { Roles } from 'constants/roles'
import { getIDsOfValidAccesses } from 'helpers/get_ids_of_valid_accesses'

const notificationsType = {
  201: 'Sent your letter successfully',
  401: 'Something went wrong with your account',
  403: 'You cannot use this functionality',
}

interface GetTimeOffsByModel {
  userID?: string
  rolesInCompany?: Roles[]
  rolesInDepartments?: RolesInDepartments
  type: string
  isExceptMeInMembers?: boolean
}

function getTimeOffsByModel(
  data,
  {
    type,
    userID = '',
    rolesInCompany,
    rolesInDepartments,
  }
: GetTimeOffsByModel) {
  const timeOffs: TimeOffModel[] = []

  if (!data || !data.length) {

    return timeOffs
  }

  const checkExceptMember = (timeOff) => {
    const validFieldsShouldHaveData = ['companyID', 'startTime', 'endTime', '_id']
    const validApiData = validFieldsShouldHaveData.every((field) => !!timeOff[field])
    const exceptMeInMembers = type === 'members' && userID === timeOff?.createdBy?._id

    return !validApiData || exceptMeInMembers
  }

  data.forEach((timeOff) => {
    if (checkExceptMember(timeOff)) {
      return
    }

    const canEditTimeOffInDepartment = checkValidAccess({
      rolesInDepartments,
      validAccesses: [Roles.DEPARTMENT_MANAGER],
      departmentID: timeOff?.departmentID?._id,
    })

    const canEditTimeOffInCompany = checkValidAccess({
      rolesInCompany,
      validAccesses: [Roles.COMPANY_MANAGER],
    })

    const isManager = type === 'members' || canEditTimeOffInCompany || canEditTimeOffInDepartment

    timeOffs.push({
      isManager,
      id: timeOff?._id,
      companyName: timeOff?.companyID?.name,
      startTime: moment(timeOff?.startTime).format(dateTimeUiFormat),
      endTime:  moment(timeOff?.endTime).format(dateTimeUiFormat),
      status: timeOff?.status,
      reason: timeOff?.reason ?? '',
      name: `${timeOff?.createdBy?.lastName ?? ''} ${timeOff?.createdBy?.firstName ?? ''}`,
      departmentName: timeOff?.departmentID?.name ?? '',
      createdAt: timeOff?.createdAt,
    })
  })

  return timeOffs
}

interface GetUserDaysOffApi {
  limit?: number
  userID: string
  cursor?: string
  infiniteScroll?: boolean
}

export const getUserDaysOffApi = ({
  limit = 10,
  userID,
  cursor,
  infiniteScroll = false,
}: GetUserDaysOffApi) => async (dispatch, getState) =>  {
  try {
    const token: Token =  localStorage.getItem('access_token')
    const state = getState()
    const userInfo = state?.userInfo

    if (!infiniteScroll) {
      await dispatch(updateTimeOffLoadingStatus({
        loadingStatus: {
          ownTimeOffsLoading: false,
        },
      }))
    }

    const params = {
      limit,
      cursor,
      createdBy: userID,
      sortDirection: 'DESC',
    }

    const getDaysoff = await axios.get(
      `${config.BASE_URL}/daysoff`,
      {
        params,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!getDaysoff?.data) {
      await dispatch(updateTimeOffLoadingStatus({
        loadingStatus: {
          ownTimeOffsLoading: false,
        },
      }))

      return
    }

    const timeOffs = getTimeOffsByModel(
      getDaysoff?.data?.list,
      {
        rolesInCompany: userInfo?.rolesInCompany,
        rolesInDepartments: userInfo?.rolesInDepartments,
        userID: '',
        type: 'user',
        isExceptMeInMembers: true,
      },
    )

    const timeOffsLength = timeOffs?.length

    await dispatch(
      updatePaginationTimeOff({
        loadingStatus: {
          ownTimeOffsLoading: false,
        },
        pagination: {
          notFoundAnyOwnTimeOffs: !timeOffsLength,
          ownTimeOffs: timeOffs,
          ownTimeOffsCursor: getDaysoff?.data?.cursor,
          ownTimeOffsTotalCount: getDaysoff?.data?.totalCount,
        },
      },
    ))
  } catch (error) {
    await dispatch(updateTimeOffLoadingStatus({
      loadingStatus: {
        ownTimeOffsLoading: false,
      },
    }))
  }
}

interface GetMembersDaysOffApi {
  limit?: number
  cursor?: string
  infiniteScroll?: boolean
  userID: string
  isExceptMeInMembers?: boolean
}

export const getMembersDaysOffApi = ({
  limit = 10,
  cursor,
  infiniteScroll = false,
  isExceptMeInMembers = true,
  userID,
}: GetMembersDaysOffApi) => async (dispatch, getState) =>  {
  try {
    const token: Token =  localStorage.getItem('access_token')
    const userInfo = getState()?.userInfo
    const isAdmin = userInfo?.isAdmin
    const validAccesses = [Roles.COMPANY_MANAGER]
    const couldGetDaysOffInCompany = checkValidAccess({ validAccesses, rolesInCompany: userInfo?.rolesInCompany })
    const departmentIDs = getIDsOfValidAccesses({
      objectMap: userInfo?.rolesInDepartments,
      validAccesses: [Roles.DEPARTMENT_MANAGER],
    })

    if (!infiniteScroll) {
      await dispatch(updateTimeOffLoadingStatus({
        loadingStatus: {
          membersTimeOffsLoading: true,
        },
      }))
    }

    const queryParams = () => {
      let stringCompanies: string[] = []
      let stringDepartments: string[] = []

      if (couldGetDaysOffInCompany) {
        const currentCompanyID = userInfo?.currentCompany?._id

        stringCompanies = [currentCompanyID].
          map((companyID, index) => `orCompanyIDs[${index}]=${companyID}`)
      }

      if (!couldGetDaysOffInCompany && departmentIDs?.length) {
        stringDepartments = departmentIDs.
          map((departmentID, index) => `orDepartmentIDs[${index}]=${departmentID}`)
      }

      return `${[...stringCompanies, ...stringDepartments].join('&')}`
    }

    const params = {
      limit,
      cursor,
      sortDirection: 'DESC',
    }

    const queryString = isAdmin ? '' : queryParams()
    const shouldNotContinue = checkOnlyTrueInArray({
      conditionsArray: [
        !isAdmin,
        !queryString?.length,
      ]},
    )

    if (shouldNotContinue) {
      await dispatch(updateTimeOffLoadingStatus({
        loadingStatus: {
          membersTimeOffsLoading: false,
        },
      }))

      return
    }

    const getDaysoff = await axios.get(
      `${config.BASE_URL}/daysoff?${queryString}`,
      {
        params,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    const timeOffs = getTimeOffsByModel(
      getDaysoff?.data?.list,
      {
        userID,
        isExceptMeInMembers,
        type: 'members',
      },
    )
    const timeOffsLength = timeOffs?.length ?? 0

    await dispatch(
      updatePaginationTimeOff({
        loadingStatus: {
          membersTimeOffsLoading: false,
        },
        pagination: {
          membersTimeOffs: timeOffs,
          notFoundAnyMembersTimeOffs: !timeOffsLength,
          membersTimeOffsCursor: timeOffsLength < 1 ? 'END' : timeOffs?.[timeOffsLength - 1]?.id,
          membersTimeOffsTotalCount: getDaysoff?.data?.totalCount,
        },
      },
    ))
  } catch (error) {
    await dispatch(updateTimeOffLoadingStatus({
      loadingStatus: {
        membersTimeOffsLoading: false,
      },
    }))
  }
}

function shouldHaveChangeStatusTimeOffData({ onSelectTimeOffData }) {
  let canContinue = false
  const { timeOffID, status, timeOffIndex, fieldName }: SelectedTimeOffDataType = onSelectTimeOffData

  if (!onSelectTimeOffData) {
    return false
  }

  canContinue = checkOnlyTrueInArray({
    conditionsArray: [
      !!timeOffID,
      !!status,
      !!fieldName,
      typeof timeOffIndex === 'number',
    ],
  })

  return canContinue
}

export const changeStatusOfTimeOff = () => async (dispatch, getState) => {
  try {
    const timeOffState: TimeOffValue = getState()?.timeoff
    const haveValidData = shouldHaveChangeStatusTimeOffData({ onSelectTimeOffData: timeOffState?.onSelectTimeOffData })

    if (!haveValidData || timeOffState.updateStatusLoading) {
      return
    }

    const { timeOffID, status, timeOffIndex, fieldName }: SelectedTimeOffDataType = timeOffState?.onSelectTimeOffData

    await dispatch(updateTimeOffIndexLoading({
      isLoading: true,
      loadingIndex: timeOffIndex,
      loadingOptionName: fieldName,
    }))

    const token: Token = localStorage.getItem('access_token')

    const changeStatus = await axios({
      url: `${config.BASE_URL}/daysoff/${timeOffID}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
      data: {
        status,
      },
    })

    if (!changeStatus?.data?.status) {
      await dispatch(updateTimeOffIndexLoading({
        isLoading: false,
        loadingIndex: undefined,
        loadingOptionName: undefined,
      }))

      return
    }

    await dispatch(updateStatusTimeOff({ fieldName, timeOffIndex, status: changeStatus?.data?.status }))
    await dispatch(updateTimeOffIndexLoading({
      isLoading: false,
      loadingIndex: undefined,
      loadingOptionName: undefined,
    }))
  } catch (error) {
    const handleMessage = notificationsType[error?.response?.data?.statusCode]
    || 'Something went wrong'

    await dispatch(pushNewNotifications({ variant: 'error' , message: handleMessage }))
    await dispatch(updateTimeOffIndexLoading({
      isLoading: false,
      loadingIndex: undefined,
      loadingOptionName: undefined,
    }))
  }
}

export const getDepartmentsAndCompanies = () => async (dispatch, getState) => {
  try {
    const userInfo = getState()?.userInfo

    const token: Token =  localStorage.getItem('access_token')

    const getDepartments = await axios.get(
      `${config.BASE_URL}/departments?companyID[0]=${userInfo?.currentCompany?._id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    const noData = !getDepartments?.data?.list || !getDepartments?.data?.list?.length

    if (noData) {

      await dispatch(updateTimeOffCompaniesToRequest({
        companies: [
          { name: 'None' },
        ],
      }))

      return
    }

    const companies = getDepartmentsIntoCompanies({ departments: getDepartments?.data?.list })

    await dispatch(updateTimeOffCompaniesToRequest({
      companies: [
        { name: 'None' },
        ...companies,
      ],
    }))

  } catch (error) {

    const handleMessage = notificationsType[error?.response?.data?.statusCode]
      || 'Something went wrong'

    await dispatch(pushNewNotifications({ variant: 'error' , message: handleMessage }))
    await dispatch(updateTimeOffCompaniesToRequest({
      companies: [
        { name: 'None' },
      ],
    }))
  }
}

const messesError = notificationsType[400] || 'Something went wrong'

export const submitTimeOffRequest = () => async (dispatch, getState) => {
  try {
    const token: Token =  localStorage.getItem('access_token')
    const timeOffRequestState: TimeOffRequestProps = getState().timeOffRequest
    const timeOffsState = getState()?.timeoff

    if (timeOffRequestState.onSendingRequest) {
      return
    }

    const haveNeededData = checkOnlyTrueInArray({
      conditionsArray: [
        !!timeOffRequestState.startDate,
        !!timeOffRequestState.startTime,
        !!timeOffRequestState.endDate,
        !!timeOffRequestState.endTime,
        !!timeOffRequestState.selectedCompany?.companyID,
        !!timeOffRequestState?.reason,
      ],
    })

    if (!haveNeededData) {
      const handleError = messesError
      await dispatch(pushNewNotifications({ variant: 'error' , message: handleError }))

      return
    }

    await dispatch(updateOnSendingTimeOffRequest({ onSendingRequest: true }))

    const startTime = moment(`${timeOffRequestState.startDate}T${timeOffRequestState.startTime}`).toISOString()
    const endTime =  moment(`${timeOffRequestState.endDate}T${timeOffRequestState.endTime}`).toISOString()
    const selectedCompany = timeOffRequestState?.selectedCompany
    const selectedDepartment = timeOffRequestState?.selectedDepartment
    const payload = {
      startTime,
      endTime,
      reason: timeOffRequestState?.reason ?? null,
      departmentID: selectedDepartment?.departmentID ?? null,
      companyID: selectedCompany?.companyID ?? null,
    }

    const res = await axios.post(
      `${config.BASE_URL}/daysoff`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

    const userInfo = getState()?.userInfo
    const timeOff = res?.data
    const validRolesInDepartment = checkValidAccess({
      rolesInDepartments: userInfo?.rolesInDepartments,
      validAccesses: [Roles.DEPARTMENT_MANAGER],
      departmentID: selectedDepartment?.departmentID,
    })
    const validRolesInCompany = checkValidAccess({
      rolesInCompany: userInfo?.rolesInCompany,
      validAccesses: [Roles.COMPANY_MANAGER],
    })
    const isManager = validRolesInCompany || validRolesInDepartment

    const myNewTimeOff = {
      isManager,
      id: timeOff?._id,
      companyName: selectedCompany?.name,
      startTime: moment(timeOff?.startTime).format(dateTimeUiFormat),
      endTime:  moment(timeOff?.endTime).format(dateTimeUiFormat),
      status: timeOff?.status,
      reason: timeOff?.reason ?? '',
      name: `${userInfo?.profile?.lastName ?? ''} ${userInfo?.profile.firstName ?? ''}`,
      departmentName: selectedDepartment?.name ?? '',
    }

    const handleMessage = notificationsType[res?.status]

    await dispatch(pushNewNotifications({ variant: 'success' , message: handleMessage }))
    dispatch(updateTimeOffsReducer({ ownTimeOffs: [myNewTimeOff, ...timeOffsState?.ownTimeOffs] }))
    dispatch(updateTimeOffRequestReducer({ onSendingRequest: false, onRequest: false, reason: '', selectedContent: {} }))
  } catch (error) {

    const handleMessage = notificationsType[error?.response?.data?.statusCode] || 'Something went wrong'

    dispatch(updateTimeOffRequestReducer({ onSendingRequest: false, selectedCompany: undefined, selectedDepartment: undefined }))
    await dispatch(pushNewNotifications({ variant: 'error' , message: handleMessage }))
  }
}

export const getTimeoffByIDThunkAction = (timeOffID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token')

    if (!token) {
      return
    }
    const res = await axios.get(`${config.BASE_URL}/daysOff/${timeOffID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

    dispatch(getTimeOffByID(res.data))
  } catch (error) {
    throw error
  }
}
