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
  ChangeCurrentIndexAccountTabs = 'ChangeCurrentIndexAccountTabs',
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

export const changeCurrentIndexAccountTabs = ({ currentIndex }) => {
  return {
    currentIndex,
    type: AccountActionTypes.ChangeCurrentIndexAccountTabs,
  };
};
