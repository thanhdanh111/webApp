import { combineReducers } from 'redux';
import { userInfo }  from '../pages/login/logic/login_reducer';
import { usersReducer } from '../pages/users/logic/users_reducer';
import accountReducer from '../pages/account/logic/account_reducer';
import statisticsReducer from 'pages/statistics/logic/statistics_reducer';
import inviteReducer from '../pages/invite_members/logic/invite_reducer';
import timeOffReducer from 'pages/time_off/logic/time_off_reducer';
import { projectsReducer } from 'pages/projects/logic/projects_reducer';
import timeOffRequestReducer from 'pages/time_off/logic/time_off_request_reducer';
import { eventLogsReducer } from 'pages/event_logs/logic/event_log_reducer';
import companyReducer from 'pages/company/logic/company_reducer';
import { notificationReducer } from './common/notifications/reducer';
import { boardsReducer } from 'pages/board/logic/board_reducer';
import { taskBoardsReducer } from 'pages/task_boards/logic/task_boards_reducer';
import { tagTasksReducer } from 'pages/tag_tasks/logic/tag_tasks_reducer';

const rootReducer = combineReducers({
  accountReducer,
  userInfo,
  account: accountReducer,
  inviteMembers: inviteReducer,
  users: usersReducer,
  taskBoards: taskBoardsReducer,
  statistics: statisticsReducer,
  timeoff: timeOffReducer,
  projects: projectsReducer,
  timeOffRequest: timeOffRequestReducer,
  eventLogs: eventLogsReducer,
  company: companyReducer,
  newNotifications: notificationReducer,
  boards: boardsReducer,
  tagTasks: tagTasksReducer,
});

export default rootReducer;

// Infer the `RootState` and `AppDispatch` types from the rootReducer itself
export type RootState = ReturnType<typeof rootReducer>;
