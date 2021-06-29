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

  if (!access || !access?.length) {
    return {
      companyID,
      departmentID,
    };
  }

  for (const each of access) {
    if (each?.companyID) {
      companyID = each.companyID;
    }

    if (each?.departmentID) {
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
