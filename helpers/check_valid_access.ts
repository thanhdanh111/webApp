import { Roles } from '../constants/roles';
import { RolesInDepartments } from './type';
import { compareAccesses } from '../helpers/compare_accesses';

interface CheckValidAccess {
  rolesInCompany?: Roles[];
  rolesInDepartments?: RolesInDepartments;
  validAccesses?: Roles[];
  departmentID?: string;
}

export function checkValidAccess({ rolesInCompany, rolesInDepartments, validAccesses, departmentID }: CheckValidAccess) {
  let isValid = false;

  if (rolesInCompany?.length) {
    isValid = compareAccesses({ validAccesses, currentAccesses: rolesInCompany });
  }

  if (rolesInDepartments && departmentID?.length) {
    isValid = compareAccesses({ validAccesses, currentAccesses: rolesInDepartments?.[departmentID] });
  }

  return isValid;
}
