import moment from 'moment';
import { TimeOffRequestActionTypes } from './time_off_actions';
import { TimeOffRequestValue } from './time_off_interface';

const currentDateTime = moment();

const initialTimeOffRequestState: TimeOffRequestValue = {
  onRequest: false,
  onSendingRequest: false,
  companies: [],
  startDate: currentDateTime.format('YYYY-MM-DD'),
  endDate: currentDateTime.format('YYYY-MM-DD'),
  startTime: currentDateTime.add(30, 'minutes').format('HH:mm'),
  endTime: currentDateTime.add(1, 'hour').format('HH:mm'),
  reason: '',
  timeOffRequestNotifications: [],
};

const timeOffRequestReducer = (state = initialTimeOffRequestState, action) => {
  switch (action.type) {
    case TimeOffRequestActionTypes.UpdateTimeOffCompaniesToRequest:

      return {
        ...state,
        companies: action.companies,
      };
    case TimeOffRequestActionTypes.UpdateContentLetter:
      if (!action?.data?.onRequest) {
        state.onSendingRequest = false;
      }

      return {
        ...state,
        ...action.data,
      };
    case TimeOffRequestActionTypes.UpdateOnSendingTimeOffRequest:
      return {
        ...state,
        onSendingRequest: action.onSendingRequest,
      };
    case TimeOffRequestActionTypes.UpdateTimeOffRequestNotifications:
      return {
        ...state,
        timeOffRequestNotifications: action.notifications,
        onSendingRequest: action.onSendingRequest,
      };
    default:
      return state;
  }
};

export default timeOffRequestReducer;
