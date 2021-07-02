import React, { FunctionComponent, useEffect } from 'react';
import ListUsers from './UI/users';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { useRouter } from 'next/router';
import { Roles } from 'constants/roles';
import { checkValidAccess } from 'helpers/check_valid_access';
import { UserInfoType } from 'helpers/type';

const validAccesses = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER];

const Users: FunctionComponent = () => {
  const router = useRouter();
  const {
    isAdmin,
    rolesInCompany,
    access,
  }: UserInfoType =  useSelector((state: RootState) => state?.userInfo);

  useEffect(() => {
    const couldAccessThiSite = isAdmin || checkValidAccess({ rolesInCompany, validAccesses });

    if (couldAccessThiSite) {

      return;
    }

    void router.replace('/access_denied', '/access_denied.html');
  }, [access]);

  return (
    <React.Fragment>
      <ListUsers />
    </React.Fragment>
  );
};

export default Users;
