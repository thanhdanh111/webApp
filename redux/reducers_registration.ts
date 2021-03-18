import { combineReducers } from 'redux';
import reducerVehicle from '../pages/home/logic/vehicle_reducer';
import accountReducer from '../pages/account/logic/account_reducer';
import headerReducer from '../components/header/logic/header_reducer';
import { auth }  from '../pages/login/logic/login_reducer';

const rootReducer = combineReducers({
  reducerVehicle,
  auth,
  accountReducer,
  headerReducer,
});

export default rootReducer;
