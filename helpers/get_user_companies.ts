import { Access } from './type';

interface GetUserCompanies {
  access: Access[];
  filterRoles?: string[];
}

export const getUserCompanies = ({ access, filterRoles }: GetUserCompanies) => {
  if (!access || !access?.length) {
    return {
      isAdmin: false,
      companies: [],
    };
  }

  const companies: string[] = [];
  let isAdmin = false;
  const storeCompanyIndice = {};

  access.forEach((each, index) => {
    if (!each?.companyID) {
      return;
    }

    if (each?.role && each?.role === 'ADMIN') {
      isAdmin = true;

      return;
    }

    const companyID = each.companyID as string;
    const isNotSuitRole = filterRoles &&
      filterRoles?.length &&
      !filterRoles.includes(each?.role);

    if (typeof storeCompanyIndice[companyID] === 'number') {
      return;
    }

    if (isNotSuitRole) {
      return;
    }

    storeCompanyIndice[companyID] = index;

    companies.push(companyID);
  });

  return {
    isAdmin,
    companies,
  };
};
