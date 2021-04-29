import { combineReducers } from 'redux';
import { auth }  from '../pages/login/logic/login_reducer';
import { usersReducer } from '../pages/users/logic/users_reducer';
import accountReducer from '../pages/account/logic/account_reducer';
import headerReducer from '../components/header/logic/header_reducer';
import statisticsReducer from 'pages/statistics/logic/statistics_reducer';
import inviteReducer from '../pages/invite_members/logic/invite_reducer';
import { taskStatusesReducer } from 'pages/home/logic/home_reducer';
import accessReducer from 'pages/access_denied/logic/access_reducer';
import timeOffReducer from 'pages/time_off/logic/time_off_reducer';
import { eventLogsReducer } from 'pages/event_logs/logic/event_log_reducer';

const rootReducer = combineReducers({
  auth,
  access: accessReducer,
  account: accountReducer,
  headers: headerReducer,
  inviteMembers: inviteReducer,
  users: usersReducer,
  taskStatuses: taskStatusesReducer,
  statistics: statisticsReducer,
  timeoff: timeOffReducer,
  eventLogs: eventLogsReducer,
});

export default rootReducer;

// Infer the `RootState` and `AppDispatch` types from the rootReducer itself
export type RootState = ReturnType<typeof rootReducer>;
