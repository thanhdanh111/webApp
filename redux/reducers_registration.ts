import { combineReducers } from 'redux';
import reducerVehicle from '../pages/home/logic/vehicle_reducer';
import { auth }  from '../pages/login/logic/login_reducer';
import { usersReducer } from '../pages/users/logic/users_reducer';
import accountReducer from '../pages/account/logic/account_reducer';
import headerReducer from '../components/header/logic/header_reducer';
import statisticsReducer from 'pages/statistics/logic/statistics_reducer';
import inviteReducer from '../pages/invite_members/logic/invite_reducer';
import accessReducer from 'pages/access_denied/logic/access_reducer';

const rootReducer = combineReducers({
  auth,
  access: accessReducer,
  vehicle: reducerVehicle,
  account: accountReducer,
  headers: headerReducer,
  inviteMembers: inviteReducer,
  users: usersReducer,
  statistics: statisticsReducer,
});

export default rootReducer;

// Infer the `RootState` and `AppDispatch` types from the rootReducer itself
export type RootState = ReturnType<typeof rootReducer>;
