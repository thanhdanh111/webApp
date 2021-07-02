import React, { FunctionComponent, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography, Box, Divider,
} from '@material-ui/core';
import InviteMembersUI from './UI/invite_members';
import ChooseCompaniesUI from './UI/choose_companies';
import { getDepartmentsOfCompany } from './logic/invite_apis';
import { InviteStateProps } from './logic/invite_interface';
import { RootState } from 'redux/reducers_registration';

export enum InviteMembersPageFlow {
  InviteMembers = 'inviteMembers',
  ChoosingCompanies = 'chooseCompanies',
}

function switchUIflow(currentPage) {

  switch (currentPage) {
    case InviteMembersPageFlow.InviteMembers:
      return <InviteMembersUI />;
    case InviteMembersPageFlow.ChoosingCompanies:
      return <ChooseCompaniesUI />;

    default:
      return <ChooseCompaniesUI />;
  }
}

function switchTitleflow({ currentPage, companyName }) {

  switch (currentPage) {
    case InviteMembersPageFlow.ChoosingCompanies:
      return 'Choose Your Company To Invite Members';
    case InviteMembersPageFlow.InviteMembers:
      return `Invite to ${companyName} Company`;

    default:
      return 'Choose Your Company To Invite Members';
  }
}

const InviteMembersPage: FunctionComponent = () => {
  const {
    currentPage,
    inviteCompany,
  }: InviteStateProps = useSelector((state: RootState) => state.inviteMembers);
  const access = useSelector((state: RootState) => state?.userInfo?.access);

  const dispatch = useDispatch();

  useEffect(()  =>  {
    dispatch(getDepartmentsOfCompany());
  }, [access]);

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
            {
              switchTitleflow({
                currentPage,
                companyName: inviteCompany?.name,
              })
            }
          </Typography>
        </div>

        <Divider variant='middle'/>

          {switchUIflow(currentPage)}
        </Box>
      </div>
    </>
  );

};

export default InviteMembersPage;
