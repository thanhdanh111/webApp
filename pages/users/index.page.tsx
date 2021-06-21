import React, { FunctionComponent, useEffect } from 'react';
import ListUsers from './UI/users';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { useRouter } from 'next/router';
import { Roles } from 'constants/roles';

const validAccess = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER];

const Users: FunctionComponent = () => {
  const router = useRouter();
  const access = useSelector((state: RootState) => state?.access);

  useEffect(() => {
    const couldAccess = access?.rolesInCompany.some((role) => validAccess.includes(role));
    const couldAccessThiSite = access?.isAdmin || couldAccess;

    if (couldAccessThiSite) {

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
