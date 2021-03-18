import React, { FunctionComponent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import {
  Avatar, Box, Typography, FormControlLabel, Switch,
  TextField,
} from '@material-ui/core';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { publicProfile, saveAccountInfo } from '../logic/account_actions';

const labels = [
  {
    fieldName: 'Name',
    stateName: 'name',
  },
  {
    fieldName: 'Email Address',
    stateName: 'email',
  },
  {
    fieldName: 'Phone Number',
    stateName: 'phoneNumber',
  },
  {
    fieldName: 'Address',
    stateName: 'address',
  },
  {
    fieldName: 'Country',
    stateName: 'country',
  },
  {
    fieldName: 'State/Region',
    stateName: 'region',
  },
  {
    fieldName: 'City',
    stateName: 'city',
  },
  {
    fieldName: 'Zip/Code',
    stateName: 'zipCode',
  },
  {
    fieldName: 'About',
    stateName: 'about',
  },
];

const GeneralTabUi: FunctionComponent = ({}) => {
  const accountState = useSelector((state) => state.accountReducer);
  const dispatch = useDispatch();
  const newState = { };

  function handleSaveChanges() {
    return dispatch(saveAccountInfo({ changedInfo: newState }));
  }

  function uploadImage() {
    return 'uploaded';
  }

  function onFilling(event: React.ChangeEvent<HTMLInputElement>) {
    newState[event.target.id] = event.target.value;

    return;
  }

  const FillOutTextFields = labels.map((label, index) => {
    if (index === labels.length - 1) {
      return <Box key={`${label.fieldName}-${index}`} className={'large-container'} >
        <form noValidate autoComplete='off' className='text-field-form' >
          <TextField
            id={label.stateName}
            color='secondary'
            rows={3}
            multiline
            className='text-field'
            label={label.fieldName}
            variant='outlined'
            onChange={onFilling}
            defaultValue={accountState[label.stateName]}
          />
        </form>
      </Box>;
    }

    return <Box key={`${label.fieldName}-${index}`} className={'text-field-container'} >
      <form noValidate autoComplete='off' className='text-field-form' >
        <TextField
          id={label.stateName}
          color='secondary'
          className='text-field'
          label={label.fieldName}
          onChange={onFilling}
          variant='outlined'
          defaultValue={accountState[label.stateName]}
        />
      </form>
    </Box>;
  });

  return (
    <Box className='general-tab'>
      <Box className='avatar-section'>
        <Box className='avatar-cricle-border'>
          <Avatar
                className='profile-picture'
                alt='user icon'
                src='../test.png'
          />
          <Box className='update-image-overlay' onClick={() => uploadImage()}>
            <AddAPhotoIcon className='update-image-icon' />
            <Typography className='update-image-text'>Update Photo</Typography>
          </Box>
        </Box>
        <Typography className='upload-avatar-text first-line'>
          Allowed *.jpeg, *.jpg, *.png, *.gif
        </Typography>
        <Typography className='upload-avatar-text'>
          Max size of 3.1 MB
        </Typography>
        <FormControlLabel
          control={<Switch checked={accountState.isPublicProfile} onChange={() => dispatch(publicProfile())} name='isPublic'/>}
          label='Public Profile'
          className='public-switch-text'
          labelPlacement='start'
        />
      </Box>
      <Box className='information-fillout'>
        {FillOutTextFields}
        <PrimaryButtonUI handleClick={() => handleSaveChanges()} title='Save Changes' />
      </Box>
    </Box>
  );
};

export default GeneralTabUi;
