import { updateInviteMembers } from './invite_actions'
import { inviteMembersApi } from './invite_apis'

export const inviteMembersThunkAction = ({ inviteMembersData }) => async (dispatch) => {
  try {
    if (!inviteMembersData || !inviteMembersData?.length) {
      return
    }

    await dispatch(inviteMembersApi({  inviteMembers: inviteMembersData }))
  } catch (error) {
    await dispatch(updateInviteMembers({ isLoading: false }))
  }
}
