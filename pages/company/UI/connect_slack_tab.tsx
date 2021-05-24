import React, { FunctionComponent } from 'react';
import {
  Avatar,
  Box, TextField, Typography,
} from '@material-ui/core';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { sendSlackCompanyToken } from '../logic/company_apis';
import { CompanyStateType } from '../logic/company_reducer';
import { fillingToken } from '../logic/company_actions';
import BusinessIcon from '@material-ui/icons/Business';

const ConnectSlackTabUi: FunctionComponent = ({}) => {
  const dispatch = useDispatch();
  const { onSendingToken, slackToken }: CompanyStateType = useSelector((state: RootState) => state.company);
  const auth = useSelector((state: RootState) => state.auth);

  function handleSavingChanges() {
    if (onSendingToken || !slackToken) {
      return;
    }

    return dispatch(sendSlackCompanyToken());
  }

  function handleFillingToken(event) {
    if (typeof event?.target?.value !== 'string' || !event?.target?.name) {
      return;
    }

    const data = {};
    data[event?.target?.name] = event?.target?.value;

    return dispatch(fillingToken({ data }));
  }

  function handleButtonContent() {
    if (onSendingToken) {
      return 'Sending...';
    }

    if (auth?.extendedCompany?.slackToken) {
      return 'Update';
    }

    return 'Send';
  }

  return <Box className='password-tab'>
    <Typography
      variant='h4'
      className='slack-tab--company-title'
    >
      {auth?.extendedCompany?.companyID?.name ?? 'My Company'}
    </Typography>
    <Box className='connect-slack-tab'>
      <Avatar
        variant='rounded'
        src={auth?.extendedCompany?.companyID?.photos?.[0]}
        style={{
          height: '55px',
          width: '55px',
          backgroundColor: '#00AB55',
        }}
      >
        <BusinessIcon />
      </Avatar>
      <form noValidate autoComplete='off' className='text-field-form' >
        <TextField
          value={slackToken}
          name='slackToken'
          color='secondary'
          className='text-field'
          onChange={(event) => handleFillingToken(event)}
          variant='outlined'
          label='Please enter your SLACK token here'
        />
      </form>
      <PrimaryButtonUI
        handleClick={() => handleSavingChanges()}
        title={handleButtonContent()}
      />
    </Box>
  </Box>;
};

export default ConnectSlackTabUi;
