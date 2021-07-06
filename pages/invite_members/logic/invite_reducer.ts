import { InviteActionTypes } from './invite_actions';
import { InviteValue } from './invite_interface';

const initialState: InviteValue = {
  inviteMembers: [
    {
      email: '',
      role: 'COMPANY_STAFF',
    },
  ],
  availInviteCompanies: [],
  currentPage: 'choosingCompanies',
  inviteCompany: {
    name: '',
    companyID: '',
    departments: [],
  },
  inviteLoading: false,
  hasNoCompanies: false,
};

// tslint:disable-next-line: cyclomatic-complexity
const inviteReducer = (state = initialState, action) => {
  switch (action.type) {
    case InviteActionTypes.updateInviteMembers:
      return {
        ...state,
        inviteMembers: action.inviteMembers,
      };
    case InviteActionTypes.chooseCompany:
      return {
        ...state,
        ...action.data,
      };
    case InviteActionTypes.backToChooseCompany:
      return {
        ...state,
        ...action.data,
      };
    case InviteActionTypes.updateAvailCompanies:
      if (!action?.availCompanies?.length) {
        state.hasNoCompanies = true;
      }

      return {
        ...state,
        availInviteCompanies: action.availCompanies,
        inviteLoading: action.isLoading,
      };
    case InviteActionTypes.inviteMembers:
      return {
        ...state,
        inviteMembers: [],
      };
    case InviteActionTypes.inviteLoading:
      return {
        ...state,
        inviteLoading: action.isLoading,
      };
    default:
      return state;
  }
};

export default inviteReducer;
