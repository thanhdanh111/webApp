import { AccountActionTypes } from './account_actions';

interface AccountValue {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: string;
  region: string;
  city: string;
  zipCode: string;
  about: string;
  isPublicProfile: boolean;
}

const initialState: AccountValue = {
  name: 'Account UI',
  email: 'tuan@company.cc',
  phoneNumber: '123456789',
  address: '',
  country: 'VietNam',
  region: '+84',
  about: '',
  city: 'Ho Chi Minh',
  zipCode: '70000',
  isPublicProfile: false,
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case AccountActionTypes.saveAccountInfo:
      return {
        ...state,
        ...action,
      };
    case AccountActionTypes.publicProfile:
      return {
        ...state,
        isPublicProfile: !state?.isPublicProfile,
      };
    default:
      return state;
  }
};

export default accountReducer;
