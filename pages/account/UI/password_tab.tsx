import React, { FunctionComponent, useState } from 'react';
import {
  Box, TextField,
} from '@material-ui/core';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { passwordInputErrors } from '../../../helpers/input_password_cases';

const labels = [
  {
    fieldName: 'Old Password',
    helperText: '',
    id: 'oldPassword',
    required: true,
  },
  {
    fieldName: 'New Password',
    helperText: 'Password must be minimum 6+',
    id: 'newPassword',
    checkLength: 6,
    required: true,
  },
  {
    fieldName: 'Confirm New Password',
    helperText: '',
    id: 'confirmPassword',
    required: false,
  },
];

const PasswordTabUi: FunctionComponent = ({}) => {
  const [throwErrorState, setThrowErrorsState] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  function handleFilling(event, label) {
    if (label.required && event.target.value) {
      setThrowErrorsState({
        ...throwErrorState,
        [event.target.id]: passwordInputErrors(event.target.value, label),
      });
    }

    return;
  }

  function handleSavingChanges() {
    return 'Saved';
  }

  function warningEmpty(event, label) {
    if (!label.required || (label.required  && event.target.value)) {
      return;
    }

    setThrowErrorsState({
      ...throwErrorState,
      [event.target.id]: passwordInputErrors(event.target.value, label),
    });
  }

  const FillOutTextFields = labels.map((label, index) => {
    return <Box
      key={`${label.fieldName}-${index}`}
      className='password-text-field-container'
    >
      <form noValidate autoComplete='off' className='text-field-form' >
        <TextField
          onBlur={(event) => warningEmpty(event, label)}
          id={label.id}
          type='password'
          color='secondary'
          className='text-field'
          onChange={(event) => handleFilling(event, label)}
          label={label.fieldName}
          variant='outlined'
          error={!!throwErrorState[label.id]}
          helperText={!!throwErrorState[label.id] ? throwErrorState[label.id] : label.helperText}
        />
      </form>
    </Box>;
  });

  return (
    <Box className='password-tab'>
      {FillOutTextFields}
      <PrimaryButtonUI
        handleClick={() => handleSavingChanges()}
        title='Save Changes'
      />
    </Box>
  );
};

export default PasswordTabUi;
