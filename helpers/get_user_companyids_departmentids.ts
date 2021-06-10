import { checkOnlyTrueInArray } from './check_only_true';
import { Access } from './type';
import { Roles } from 'constants/roles';

interface GetUserCompanies {
  access: Access[];
  filterRoles?: string[];
}

interface GetUserCompanyIDsAndDepartmentIDs {
  companyIDs: string[];
  departmentIDs: string[];
  companyIDsOfDepartmentIDs: string[];
  isAdmin: boolean;
}

export type GetUserCompanyIDsAndDepartmentIDsType = GetUserCompanyIDsAndDepartmentIDs;

export const getUserCompanyIDsAndDepartmentIDs = ({
  access,
  filterRoles,
}: GetUserCompanies): GetUserCompanyIDsAndDepartmentIDs => {
  if (!access || !access?.length) {
    return {
      isAdmin: false,
      companyIDs: [],
      departmentIDs: [],
      companyIDsOfDepartmentIDs: [],
    };
  }

  const companyIDs: string[] = [];
  const departmentIDs: string[] = [];
  const companyIDsOfDepartmentIDs: string[] = [];
  let isAdmin = false;
  const filteredCompanies = { };
  const filteredDepartmentIDs = { };

  access.forEach((each, index) => {
    const companyID = each?.companyID as string;
    const departmentID = each?.departmentID as string;
    const filteredCompanyID = (!departmentID && filteredCompanies[companyID] !== undefined);

    if (!companyID || filteredCompanyID) {
      return;
    }

    const isAdminRole = checkOnlyTrueInArray({
      conditionsArray: [
        each?.role,
        each?.role === Roles.ADMIN,
      ],
    });

    if (isAdminRole) {
      isAdmin = true;

      return;
    }

    const isNotSuitRole = filterRoles &&
      filterRoles?.length &&
      !filterRoles.includes(each?.role ?? '');

    if (isNotSuitRole) {
      return;
    }

    if (!departmentID) {
      filteredCompanies[companyID] = index;
      companyIDs.push(companyID);

      return;
    }

    if (filteredDepartmentIDs[departmentID] !== undefined) {

      return;
    }

    filteredDepartmentIDs[departmentID] = index;
    departmentIDs.push(departmentID);
    companyIDsOfDepartmentIDs.push(companyID);
  });

  return {
    isAdmin,
    companyIDs,
    departmentIDs,
    companyIDsOfDepartmentIDs,
  };
};
