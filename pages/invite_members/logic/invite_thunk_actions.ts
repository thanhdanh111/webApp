import { inviteMembersApi } from './invite_apis';
import { inviteLoading } from './invite_actions';

export const inviteMembersThunkAction = ({ companyID, inviteMembersData }) => async (dispatch) => {
  try {
    if (!companyID || !inviteMembersData || !inviteMembersData?.length) {
      return;
    }

    await dispatch(inviteMembersApi({ companyID, inviteMembers: inviteMembersData }));
  } catch (error) {
    await dispatch(inviteLoading({ isLoading: false }));
  }
};
