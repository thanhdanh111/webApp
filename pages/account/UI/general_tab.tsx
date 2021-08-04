import React, { FunctionComponent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import { Box, Typography, TextField } from '@material-ui/core'
import PrimaryButtonUI from '@components/primary_button/primary_button'
import { RootState } from 'redux/reducers_registration'
import UserAvatar from '@components/user_avatar/info_user'
import { OptionsSelect, SelectColor, SelectVariant } from '@components/options_select/options_select'
import { saveUserInfo } from '../logic/account_apis'

const labels = [
  {
    fieldName: 'First Name',
    stateName: 'firstName',
    disabled: true,
    splitComponents: true,
  },
  {
    fieldName: 'Last Name',
    stateName: 'lastName',
    disabled: true,
    splitComponents: true,
  },
  {
    fieldName: 'Email Address',
    stateName: 'email',
    disabled: true,
  },
  {
    fieldName: 'Day of Birth',
    stateName: 'dob',
    type: 'date',
  },
  {
    fieldName: 'Gender',
    stateName: 'gender',
    type: 'select',
    selectValues: ['OTHER', 'FEMALE', 'MALE'],
  },
  {
    fieldName: 'Phone Number',
    stateName: 'phoneNumber',
  },
  {
    fieldName: 'Address',
    stateName: 'address',
  },
]

const GeneralTabUi: FunctionComponent = ({}) => {
  const loading = useSelector((state: RootState) => state?.account?.loading)
  const userProfile = useSelector((state: RootState) => {

    return {
      profilePhoto: state?.userInfo?.profile?.profilePhoto,
      email: state?.userInfo?.profile?.email,
      lastName: state?.userInfo?.profile?.lastName,
      firstName: state?.userInfo?.profile?.firstName,
      gender: state?.userInfo?.extendedProfile?.gender,
      phoneNumber: state?.userInfo?.extendedProfile?.phoneNumber,
      dob: state?.userInfo?.extendedProfile?.dob ?? state?.userInfo?.extendedProfile?.createdAt,
      address: state?.userInfo?.extendedProfile?.address,
    }
  })
  const dispatch = useDispatch()
  const newState = { }

  function handleSaveChanges() {
    return dispatch(saveUserInfo(newState))
  }

  function uploadImage() {
    return 'uploaded'
  }

  function handleSelectChange({ event }) {
    const name = event?.target?.name
    const value = event?.target?.value

    newState[name] = value

    return
  }

  function onFilling(event: React.ChangeEvent<HTMLInputElement>) {
    const name = event?.target?.name
    const value = event?.target?.value

    if (name === 'dob') {
      newState[name] = moment(value ?? userProfile?.dob).toISOString()

      return
    }

    newState[name] = value

    return
  }

  const FillOutTextFields = labels.map((label, index) => {
    const fieldName = label.fieldName
    if (label?.type === 'select') {

      const options = label?.selectValues?.map((value) =>
          <option
            value={value}
            key={value}
          >
            {value}
          </option>,
        )

      return <Box key={`${fieldName}-${index}`} className='text-field-container'>
        <OptionsSelect
          defaultValue={userProfile?.[label.stateName]}
          htmlFor='outlined-gender-select'
          handleFillingInfo={handleSelectChange}
          options={options ?? []}
          inputLabel={fieldName}
          formName='gender'
          color={SelectColor.secondary}
          variant={SelectVariant.outlined}
        />
      </Box>
    }

    return <Box
      key={`${fieldName}-${index}`}
      className={
        label.splitComponents ?
          'text-field-container--split-components' :
          'text-field-container'
        }
    >
      <form noValidate autoComplete='off' className='text-field-form' >
        <TextField
          name={label.stateName}
          color='secondary'
          disabled={label.disabled}
          className='text-field'
          type={label.type}
          label={label.fieldName}
          onChange={onFilling}
          variant='outlined'
          defaultValue={label.type === 'date' ?
            moment(userProfile?.[label.stateName]).format('YYYY-MM-DD') :
            userProfile?.[label.stateName]
          }
        />
      </form>
    </Box>
  })

  return (
    <Box className='general-tab'>
      <Box className='avatar-section'>
        <Box className='avatar-cricle-border'>
          <UserAvatar alt='user icon' style='profile-picture' user={userProfile} />
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
      </Box>
      <Box className='information-fillout'>
        {FillOutTextFields}
        <PrimaryButtonUI disabled={loading} handleClick={() => handleSaveChanges()} title='Save Changes' />
      </Box>
    </Box>
  )
}

export default GeneralTabUi
