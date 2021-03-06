import axios from 'axios'
import { config } from 'helpers/get_config'
import { EventLogPage, EventLogState } from './event_log_interface'
import { eventLogsAction } from './event_log_type_action'
import { getEventLog, getEventLogs,  hasNoEventLogs,  hideLoader } from './event_log_action'
import { checkIfEmptyArray } from 'helpers/check_if_empty_array'
import moment from 'moment'
import { getLastDay } from 'helpers/get_last_date'
import { Roles } from 'constants/roles'
import { Token } from 'helpers/type'
import { checkValidAccess } from 'helpers/check_valid_access'

const initialState: EventLogPage = {
  projects: [],
  environments: {},
  selectedProjectID: 'All',
  selectedEnv: 'All',
  selectedTime: 1,
  sortByCreatedAt: '',
  selectedEventLog: {
    _id: '',
    breadcrumbs: [],
    exception: {
      type: '',
      value: '',
      mechanism: {
        handled: false,
        type: '',
      },
    },
    createdAt: '',
  },
  eventLogs: [],
  loading: true,
  hasNoEventLogs: false,
}

const dateTimeUiFormat = 'DD/MM/YYYY HH:mm'

// tslint:disable-next-line: cyclomatic-complexity
export const eventLogsReducer = (state = initialState, action) => {
  switch (action.type) {
    case eventLogsAction.GET_EVENT_LOGS:
      const eventLogs: EventLogState[] = []
      const environments = {}

      if (checkIfEmptyArray(action.payload.list)) {
        action?.payload?.list?.map((element) => {
          if (element?.environment) {
            environments[element?.environment] = element?.environment
          }

          eventLogs.push({
            _id: element?._id,
            exception: element?.exception?.values?.[0] || {},
            createdAt: element?.createdAt,
            breadcrumbs: element?.breadcrumbs,
          })

        })
      }

      return {
        ...state,
        eventLogs,
        environments,
      }
    case eventLogsAction.SHOW_LOADER_LIST:
      return {
        ...state,
        loading: true,
      }
    case eventLogsAction.HIDE_LOADER_LIST:
      return {
        ...state,
        loading: false,
      }
    case eventLogsAction.SET_SELECTED_ENV:
      return {
        ...state,
        selectedEnv: action.payload.selectedEnv,
      }
    case eventLogsAction.SET_SELECTED_PROJECTID:
      return {
        ...state,
        selectedProjectID: action.payload.selectedProjectID,
      }
    case eventLogsAction.SET_SELECTED_TIME:
      return {
        ...state,
        selectedTime: action.payload.selectedTime,
      }
    case eventLogsAction.GET_EVENT_LOG:
      return {
        ...state,
        selectedEventLog: action.payload,
      }
    case eventLogsAction.HAS_NO_DATA:
      return {
        ...state,
        hasNoEventLogs: true,
      }
    default:
      return state
  }
}

export const getEventLogsData = () => async (dispatch, getState) => {
  try {
    const userInfo = getState()?.userInfo
    const token: Token = localStorage.getItem('access_token')
    const validAccesses = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER, Roles.COMPANY_STAFF, Roles.DEPARTMENT_STAFF]
    const haveAccess = checkValidAccess({
      validAccesses,
      rolesInCompany: userInfo?.rolesInCompany,
      rolesInDepartments: userInfo?.rolesInDepartments,
      departmentID: userInfo?.currentDepartment?._id,
    })
    const isAdmin = userInfo?.isAdmin
    const { selectedTime, selectedEnv, selectedProjectID }: EventLogPage = getState()?.eventLogs
    const fromTime = new Date()
    const toTime = getLastDay(selectedTime)

    let companyIDParam = ''
    let departmentIDParam = ''

    if (isAdmin || haveAccess) {
      companyIDParam = userInfo?.currentCompany?._id
      departmentIDParam = userInfo?.currentDepartment?._id
    }

    const getParams = async () => {
      if (!companyIDParam) {
        await dispatch(hasNoEventLogs())

        return
      }

      return {
        fromTime,
        toTime,
        companyID: companyIDParam,
        departmentID: departmentIDParam,
        environment: selectedEnv !== 'All' ? selectedEnv : null,
        projectID: selectedProjectID && selectedProjectID !== 'All' ? selectedProjectID : null,
      }
    }

    const params = await getParams()

    const res = await axios.get(`${config.BASE_URL}/eventLogs`, {
      params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res?.data?.totalCount) {
      await dispatch(hasNoEventLogs())
      await dispatch(hideLoader())

      return
    }

    await dispatch(getEventLogs(res.data))
    await dispatch(hideLoader())
  } catch (error) {
    throw error
  }
}

export const getEventLogData = (eventLogsId) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token')

    if (!token || !eventLogsId) {
      return
    }

    const res = await axios.get(`${config.BASE_URL}/eventLogs/${eventLogsId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res?.data) {
      await dispatch(hasNoEventLogs())
      await dispatch(hideLoader())

      return
    }

    const breadcrumbs = checkIfEmptyArray(res?.data?.breadcrumbs) ?
    res?.data?.breadcrumbs?.map((element) => {
      const description = element.message ? element.message : `${element?.data?.method} ${element.data.url} [${element.data.status_code}]`

      return {
        description,
        time:  moment(element?.timestamp).format(dateTimeUiFormat),
        category: element?.category,
        level: element?.level,
      }
    }) : []

    const selectedEventLog = {
      breadcrumbs,
      _id: res?.data?._id,
      exception: res?.data?.exception?.values[0],
      createdAt: res?.data?.createdAt,
    }

    await dispatch(getEventLog(selectedEventLog))
    await dispatch(hideLoader())
  } catch (error) {
    throw error
  }
}
