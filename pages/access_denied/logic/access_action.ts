import { Roles } from 'constants/roles';
import { RolesInDepartments } from 'helpers/get_roles_of_logged_in_user';
import { AccessAction } from './access_type_action';

interface GetUserAccess {
  access?: object[];
  isAdmin?: boolean;
  rolesInCompany?: Roles[];
  rolesInDepartments?: RolesInDepartments;
}

export const GetUserAccess = (res: GetUserAccess) => {
  return {
    type: AccessAction.GET_ACCESS,
    payload: res,
  };
};
