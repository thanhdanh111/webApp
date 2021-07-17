import { checkIfEmptyArray } from './check_if_empty_array';
import { Access } from './type';

interface GetUserCompanies {
  access: Access[];
}

interface GetFirstCompanyIDAndDepartmentID {
  companyID: string;
  departmentID: string;
}

export type GetFirstCompanyIDAndDepartmentIDType = GetFirstCompanyIDAndDepartmentID;

export const getFirstCompanyIDAndDepartmentID = ({
  access,
}: GetUserCompanies): GetFirstCompanyIDAndDepartmentID => {
  let companyID;
  let departmentID;

  if (!checkIfEmptyArray(access)) {
    return {
      companyID,
      departmentID,
    };
  }

  for (const each of access) {
    if (!each.companyID) {
      continue;
    }

    if (!companyID) {
      companyID = each.companyID;
    }

    if (each?.departmentID) {
      companyID = each?.companyID;
      departmentID = each?.departmentID;

      break;
    }

    continue;
  }

  return {
    companyID,
    departmentID,
  };
};
