import { AccessAction } from './access_type_action';

export const GetUserAccess = (res: object[]) => {
  return {
    type: AccessAction.GET_ACCESS,
    payload: res,
  };
};
