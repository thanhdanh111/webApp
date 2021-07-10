import React, { FunctionComponent, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography, Box, Divider,
} from '@material-ui/core';
import InviteMembersUI from './UI/invite_members';
import { getDepartmentsOfCompany } from './logic/invite_apis';
import { RootState } from 'redux/reducers_registration';

const InviteMembersPage: FunctionComponent = () => {
  const userInfo = useSelector((state: RootState) => state?.userInfo);

  const dispatch = useDispatch();

  useEffect(()  =>  {
    dispatch(getDepartmentsOfCompany());
  }, []);

  return (
    <>
      <div className='invite-members-layout'>
        <Box className='invite-members-paper'>
          <div className='invite-header'>
            <Typography
              className='invite-header-text'
              color='textSecondary'
              variant='h4'
            >
              {`Invite to ${userInfo?.currentCompany?.name} Company`}
            </Typography>
          </div>
          <Divider variant='middle'/>
          <InviteMembersUI />
        </Box>
      </div>
    </>
  );

};

export default InviteMembersPage;
