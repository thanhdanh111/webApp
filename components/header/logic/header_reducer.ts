import { HeaderActionTypes } from './header_actions';

interface HeaderValue {
  isOpenDrawer: boolean;
}

const initialState: HeaderValue = {
  isOpenDrawer: false,
};

const headerReducer = (state = initialState, action) => {
  switch (action.type) {
    case HeaderActionTypes.openDrawer:
      return {
        ...state,
        isOpenDrawer: !state.isOpenDrawer,
      };
    default:
      return state;
  }
};

export default headerReducer;
