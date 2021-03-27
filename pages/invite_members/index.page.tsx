import React, { FunctionComponent, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography, Box, Divider,
} from '@material-ui/core';
import InviteMembersUI from './UI/invite_members';
import ChooseCompaniesUI from './UI/choose_companies';
import { getUserCompaniesApi } from './apis/invite_apis';
import { useSnackbar, WithSnackbarProps } from 'notistack';
import { InviteStateProps } from './logic/invite_interface';
import { updateInviteResultInfo } from './logic/invite_actions';
import { returnNotification } from './logic/invite_error_notifications';

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
  const { currentPage, inviteCompany, inviteResultInfo }: InviteStateProps = useSelector((state) => state.inviteMembers);

  const dispatch = useDispatch();
  const { enqueueSnackbar }: WithSnackbarProps = useSnackbar();

  useEffect(()  =>  {
    dispatch(getUserCompaniesApi());
  }, []);

  useEffect(pushNotification, [inviteResultInfo]);

  function pushNotification() {

    if (inviteResultInfo && typeof inviteResultInfo !== 'string' && inviteResultInfo.length) {
      for (const resultInfo of inviteResultInfo) {
        const newResultInfo = returnNotification({ resultInfo });

        if (!resultInfo) {
          continue;
        }

        enqueueSnackbar(newResultInfo['message'], { variant: newResultInfo['status'] });
      }

      dispatch(updateInviteResultInfo({ inviteResultInfo: [] }));
    }

    return;
  }

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
