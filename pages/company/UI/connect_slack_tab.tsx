import React, { FunctionComponent } from 'react';
import {
  Box, TextField,
} from '@material-ui/core';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { sendSlackCompanyToken } from '../logic/company_apis';
import { CompanyStateType } from '../logic/company_reducer';
import { fillingToken } from '../logic/company_actions';

const labels = [
  {
    fieldName: 'Please enter your SLACK token here',
    helperText: '',
    id: 'slackToken',
    required: false,
  },
];

const ConnectSlackTabUi: FunctionComponent = ({}) => {
  const dispatch = useDispatch();
  const { onSendingToken, slackToken }: CompanyStateType = useSelector((state: RootState) => state.company);

  function handleSavingChanges() {
    if (onSendingToken || !slackToken) {
      return;
    }

    return dispatch(sendSlackCompanyToken());
  }

  function handleFillingToken(event) {
    if (!event?.target?.value || !event?.target?.id) {
      return;
    }

    const data = {};
    data[event?.target?.id] = event?.target?.value;

    return dispatch(fillingToken({ data }));
  }

  const FillOutTextFields = labels.map((label, index) => {
    return <Box
      key={`${label.fieldName}-${index}`}
      className='password-text-field-container'
    >
      <form noValidate autoComplete='off' className='text-field-form' >
        <TextField
          id={label.id}
          color='secondary'
          className='text-field'
          onChange={(event) => handleFillingToken(event)}
          label={label.fieldName}
          variant='outlined'
          helperText={label.helperText}
        />
      </form>
    </Box>;
  });

  return (
    <Box className='password-tab connect-slack-tab'>
      {FillOutTextFields}
      <PrimaryButtonUI
        handleClick={() => handleSavingChanges()}
        title={onSendingToken ? 'Sending...' : 'Send Token'}
      />
    </Box>
  );
};

export default ConnectSlackTabUi;
