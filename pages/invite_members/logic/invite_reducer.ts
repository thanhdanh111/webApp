import { InviteActionTypes } from './invite_actions';
import { InviteValue } from './invite_interface';

const initialState: InviteValue = {
  inviteMembers: [
    {
      email: '',
      role: 'COMPANY_STAFF',
    },
  ],
  departments: [
    {
      name: 'none',
      departmentID: '',
    },
  ],
  loading: false,
  inviteLoading: false,
};

const inviteReducer = (state = initialState, action) => {
  switch (action.type) {
    case InviteActionTypes.updateInviteMembers:

      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};

export default inviteReducer;
