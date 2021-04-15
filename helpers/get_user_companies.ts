import { Access } from '../pages/login/logic/login_reducer';

interface GetUserCompanies {
  access: Access[];
  filterRoles?: string[];
}

export const getUserCompanies = ({ access, filterRoles }: GetUserCompanies) => {
  const companies: string[] = [];
  let isAdmin = false;

  access.forEach((each) => {
    if (!each?.companyID) {
      return;
    }

    if (each?.role && each?.role === 'ADMIN') {
      isAdmin = true;

      return;
    }

    const isNotSuitRole = filterRoles &&
      filterRoles?.length &&
      !filterRoles.includes(each?.role);

    if (isNotSuitRole) {
      return;
    }

    companies.push(each?.companyID);
  });

  return {
    isAdmin,
    companies,
  };
};
