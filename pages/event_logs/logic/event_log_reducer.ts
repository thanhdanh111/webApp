import axios from 'axios';
import { config } from 'helpers/get_config';
import { EventLogPage, EventLogState } from './event_log_interface';
import { eventLogsAction } from './event_log_type_action';
import { getEventLog, getEventLogs,  hasNoEventLogs,  hideLoader, showLoader } from './event_log_action';
import { checkArray } from 'helpers/check_array';
import moment from 'moment';

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
};

const dateTimeUiFormat = 'DD/MM/YYYY HH:mm';

export const eventLogsReducer = (state = initialState, action) => {
  switch (action.type) {
    case eventLogsAction.GET_EVENT_LOGS:
      const eventLogs: EventLogState[] = [];
      const environments = {};

      if (checkArray(action.payload.list)) {
        action?.payload?.list?.map((element) => {
          if (element?.environment) {
            environments[element.environment] = element?.environment;
          }

          eventLogs.push({
            _id: element?._id,
            exception: element?.exception?.values?.[0] || {},
            createdAt: element?.createdAt,
            breadcrumbs: element?.breadcrumbs,
          });

        });
      }

      return {
        ...state,
        eventLogs,
        environments,
      };
    case eventLogsAction.SHOW_LOADER_LIST:
      return {
        ...state,
        loading: true,
      };
    case eventLogsAction.HIDE_LOADER_LIST:
      return {
        ...state,
        loading: false,
      };
    case eventLogsAction.SET_SELECTED_ENV:
      return {
        ...state,
        selectedEnv: action.payload.selectedEnv,
      };
    case eventLogsAction.SET_SELECTED_PROJECTID:
      return {
        ...state,
        selectedProjectID: action.payload.selectedProjectID,
      };
    case eventLogsAction.SET_SELECTED_TIME:
      return {
        ...state,
        selectedTime: action.payload.selectedTime,
      };
    case eventLogsAction.GET_EVENT_LOG:
      return {
        ...state,
        selectedEventLog: action.payload,
      };
    case eventLogsAction.HAS_NO_DATA:
      return {
        ...state,
        hasNoEventLogs: true,
      };
    default:
      return state;
  }
};

export const getEventLogsData = () => async (dispatch, getState) => {
  try {

    const token = localStorage.getItem('access_token');

    const state = getState();

    const { selectedTime, selectedEnv, selectedProjectID }: EventLogPage = state.eventLogs;
    const fromTime = new Date();
    const toTime = Number.isInteger(selectedTime) ? new Date(fromTime.getTime() - selectedTime * 1000 * 60 * 60 * 24) : null;

    const params = {
      fromTime,
      toTime,
      environment: selectedEnv !== 'All' ? selectedEnv : null,
      projectID: selectedProjectID && selectedProjectID !== 'All' ? selectedProjectID : null,
    };

    const res = await axios.get(`${config.BASE_URL}/eventLogs`, {
      params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.data.totalCount) {
      await dispatch(hasNoEventLogs());

      return;
    }

    await dispatch(getEventLogs(res.data));
    await dispatch(hideLoader());
  } catch (error) {
    throw error;
  }
};

export const getEventLogData = (eventLogsId) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || !eventLogsId) {
      return;
    }

    await dispatch(showLoader());

    const res = await axios.get(`${config.BASE_URL}/eventLogs/${eventLogsId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res?.data && !!res?.data?.length) {
      await dispatch(hasNoEventLogs());

      return;
    }

    const breadcrumbs = checkArray(res?.data?.breadcrumbs) ?
    res?.data?.breadcrumbs?.map((element) => {
      const description = element.message ? element.message : `${element?.data?.method} ${element.data.url} [${element.data.status_code}]`;

      return {
        description,
        time:  moment(element?.timestamp).format(dateTimeUiFormat),
        category: element?.category,
        level: element?.level,
      };
    }) : [];

    const selectedEventLog = {
      breadcrumbs,
      _id: res?.data?._id,
      exception: res?.data?.exception?.values[0],
      createdAt: res?.data?.createdAt,
    };

    await dispatch(getEventLog(selectedEventLog));
    await dispatch(hideLoader());
  } catch (error) {
    throw error;
  }
};
