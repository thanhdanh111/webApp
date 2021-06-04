import React, { useEffect } from 'react';
import ListUsers from './UI/users';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { useRouter } from 'next/router';

const validAccessPage = ['COMPANY_MANAGER', 'DEPARTMENT_MANAGER'];

const Users = () => {
  const router = useRouter();
  const combinedUsersSelector = useSelector((state: RootState) => {

    return {
      access: state?.access,
      companyID: state?.auth?.extendedCompany?.companyID?._id,
    };
  });

  useEffect(checkInvalidAccess, []);

  function checkInvalidAccess() {
    const userAccesses = combinedUsersSelector?.access?.access;

    for (const userAccess of userAccesses) {
      const validAccess = validAccessPage.includes(userAccess?.role) &&
      userAccess?.companyID === combinedUsersSelector?.companyID;

      if (validAccess) {

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
