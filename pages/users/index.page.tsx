import React, { useEffect } from 'react';
import ListUsers from './UI/users';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { useRouter } from 'next/router';
import { GetRolesOfCompaniesMap, getRolesOfCompaniesMap } from 'helpers/get_roles_of_companies_map';
import { updateUsersReducer } from './logic/users_actions';
import { Roles } from 'constants/roles';

const Users = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const access = useSelector((state: RootState) => state?.access);
  const companyID = useSelector((state: RootState) => state?.auth?.extendedCompany?.companyID?._id);

  useEffect(() => {
    const userAccesses = access?.access;
    const {
      isAdmin,
      rolesOfCompanies,
    }: GetRolesOfCompaniesMap = getRolesOfCompaniesMap({ accesses: userAccesses });

    const validAccess = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER];
    const couldAccess = rolesOfCompanies?.[companyID]?.rolesInCompany?.some((role) => validAccess.includes(role));
    const couldAccessThiSite = isAdmin || couldAccess;

    if (couldAccessThiSite) {
      dispatch(updateUsersReducer({ rolesOfCompanies }));

      return;
    }

    void router.replace('/access_denied', '/access_denied.html');
  }, [access?.access]);

  return (
    <React.Fragment>
        <ListUsers />
    </React.Fragment>
  );
};

export default Users;
