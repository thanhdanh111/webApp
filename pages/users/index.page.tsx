import React, { useEffect } from 'react';
import ListUsers from './UI/users';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { useRouter } from 'next/router';
import { Roles } from 'constants/roles';

const validAccessPage = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER];

const Users = () => {
  const router = useRouter();
  const combinedUsersSelector = useSelector((state: RootState) => {

    return {
      access: state?.access,
      companyID: state?.auth?.extendedCompany?.companyID?._id,
    };
  });

  useEffect(checkInvalidAccess, [combinedUsersSelector]);

  function checkInvalidAccess() {
    const userAccesses = combinedUsersSelector?.access?.access;

    for (const userAccess of userAccesses) {
      const validAccess = validAccessPage.includes(userAccess?.role) &&
      userAccess?.companyID === combinedUsersSelector?.companyID;
      const isAdmin = userAccess?.role === Roles.ADMIN;

      if (validAccess || isAdmin) {

        return;
      }

      continue;
    }

    void router.replace('/access_denied', '/access_denied.html');
  }

  return (
    <React.Fragment>
        <ListUsers />
    </React.Fragment>
  );
};

export default Users;
