import { Notification } from 'helpers/type';

export interface AccountInfo {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  region?: string;
  city?: string;
  zipCode?: string;
  about?: string;
}

interface SaveAccountInfo {
  changedInfo: AccountInfo;
}

export enum AccountActionTypes {
  saveAccountInfo = 'saveAccountInfo',
  publicProfile = 'publicProfile',
  FillingToken = 'FillingToken',
  UpdateOnSendingToken = 'UpdateOnSendingToken',
  ChangeCurrentIndexAccountTabs = 'ChangeCurrentIndexAccountTabs',
  UpdateAccountNotifications = 'UpdateAccountNotifications',
}

export const saveAccountInfo = ({ changedInfo }: SaveAccountInfo) => {
  return {
    type: AccountActionTypes.saveAccountInfo,
    data: changedInfo,
  };
};

export const publicProfile =  () => {
  return {
    type: AccountActionTypes.publicProfile,
  };
};

interface UpdateAccountOnSending {
  loading: boolean;
  notifications?: Notification[];
}

export const updateAccountOnSending = ({ loading, notifications }: UpdateAccountOnSending) => {
  return {
    loading,
    notifications,
    type: AccountActionTypes.UpdateOnSendingToken,
  };
};

export const changeCurrentIndexAccountTabs = ({ currentIndex }) => {
  return {
    currentIndex,
    type: AccountActionTypes.ChangeCurrentIndexAccountTabs,
  };
};

export const updateAccountNotifications = ({ notifications }) => {
  return {
    notifications,
    type: AccountActionTypes.UpdateAccountNotifications,
  };
};
