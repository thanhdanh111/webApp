import { combineReducers } from 'redux';
import reducerVehicle from '../pages/home/logic/vehicle_reducer';
import accountReducer from '../pages/account/logic/account_reducer';
import headerReducer from '../components/header/logic/header_reducer';

const rootReducer = combineReducers({
  reducerVehicle,
  accountReducer,
  headerReducer,
});

export default rootReducer;
