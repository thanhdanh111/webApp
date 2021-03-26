import { InviteMembersPageFlow } from '../index.page';
import { InviteCompany } from './invite_interface';

export enum InviteActionTypes {
  updateInviteMembers = 'updateInviteMembers',
  chooseCompany = 'chooseCompany',
  backToChooseCompany = 'backToChooseCompanyPage',
  updateAvailCompanies = 'updateAvailCompanies',
  inviteMembers = 'inviteMembersPage',
  inviteLoading = 'inviteLoading',
  updateInviteResultInfo = 'updateInviteResultInfo',
}

interface ChooseInviteCompany {
  inviteCompany: InviteCompany;
}

export const chooseInviteCompany = ({ inviteCompany }: ChooseInviteCompany) => {

  return {
    data: {
      inviteCompany,
      currentPage: InviteMembersPageFlow.InviteMembers,
    },
    type: InviteActionTypes.chooseCompany,
  };
};

export const backToChooseCompany = () => {
  const resetInit = {
    inviteCompany: {
      name: '',
      id: '',
    },
    inviteMembers: [
      {
        email: '',
        role: 'COMPANY_STAFF',
      },
    ],
  };

  return {
    data: {
      ...resetInit,
      currentPage: InviteMembersPageFlow.ChoosingCompanies,
    },
    type: InviteActionTypes.chooseCompany,
  };
};

export const updateInviteCompanies = ({ availCompanies, isLoading }) => {
  return {
    availCompanies,
    isLoading,
    type: InviteActionTypes.updateAvailCompanies,
  };
};

export const inviteLoading = ({ isLoading }) => {
  return {
    isLoading,
    type: InviteActionTypes.inviteLoading,
  };
};

export const updateInviteResultInfo = ({ inviteResultInfo }) => {

  return {
    inviteResultInfo,
    type: InviteActionTypes.updateInviteResultInfo,
  };
};

export const updateInviteMembers = ({ inviteMembers }) => {

  return {
    inviteMembers,
    type: InviteActionTypes.updateInviteMembers,
  };
};
