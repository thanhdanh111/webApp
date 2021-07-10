export enum InviteActionTypes {
  updateInviteMembers = 'updateInviteMembers',
}

export const updateInviteMembers = (data) => {
  return {
    data,
    type: InviteActionTypes.updateInviteMembers,
  };
};
