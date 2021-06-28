import { Notification } from 'helpers/type';

export enum CompanyActionTypes {
  FillingToken = 'FillingToken',
  UpdateOnSendingToken = 'UpdateOnSendingToken',
  ChangeCurrentIndexAccountTabs = 'ChangeCurrentIndexAccountTabs',
  // UpdateCompanyNotifications = 'UpdateCompanyNotifications',
}

interface UpdateCompanyOnSending {
  loading: boolean;
  notifications?: Notification[];
}

export const fillingToken = ({ data }) => {
  return {
    data,
    type: CompanyActionTypes.FillingToken,
  };
};

// export const updateCompanyNotifications = ({ notifications }) => {
//   return {
//     notifications,
//     type: CompanyActionTypes.UpdateCompanyNotifications,
//   };
// };

export const updateCompanyOnSending = ({ loading }: UpdateCompanyOnSending) => {
  return {
    loading,
    type: CompanyActionTypes.UpdateOnSendingToken,
  };
};
