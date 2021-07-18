import React, { FunctionComponent } from 'react'
import {
  Box, TextField,
} from '@material-ui/core'
import PrimaryButtonUI from '@components/primary_button/primary_button'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'redux/reducers_registration'
import { sendSlackCompanyToken } from '../logic/company_apis'
import { CompanyStateType } from '../logic/company_reducer'
import { fillingToken } from '../logic/company_actions'
import { Roles } from 'constants/roles'
import { UserInfoType } from 'helpers/type'
import { checkValidAccess } from 'helpers/check_valid_access'

const validAccesses = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER]

const ConnectSlackTabUi: FunctionComponent = () => {
  const dispatch = useDispatch()
  const { onSendingToken, slackToken }: CompanyStateType = useSelector((state: RootState) => state.company)
  const {
    isAdmin,
    rolesInCompany,
    currentExtendedCompany,
  }: UserInfoType =  useSelector((state: RootState) => state?.userInfo)
  const loadMemberData = isAdmin || checkValidAccess({ rolesInCompany, validAccesses })

  function handleSavingChanges() {
    if (!loadMemberData || onSendingToken || !slackToken) {
      return
    }

    return dispatch(sendSlackCompanyToken())
  }

  function handleFillingToken(event) {
    if (typeof event?.target?.value !== 'string' || !event?.target?.name) {
      return
    }

    const data = {}
    data[event?.target?.name] = event?.target?.value

    return dispatch(fillingToken({ data }))
  }

  function handleButtonContent() {
    if (onSendingToken) {
      return 'Sending...'
    }

    if (currentExtendedCompany?.slackToken) {
      return 'Update'
    }

    return 'Send'
  }

  return (
    <Box className='connect-slack-tab'>
      <form noValidate autoComplete='off' className='text-field-form' >
        <TextField
          value={slackToken}
          name='slackToken'
          color='secondary'
          className='text-field'
          onChange={(event) => handleFillingToken(event)}
          variant='outlined'
          label='Please enter your SLACK token here'
          disabled={(!loadMemberData) ? true : false}
        />
      </form>
      <PrimaryButtonUI
        handleClick={() => handleSavingChanges()}
        title={handleButtonContent()}
        extendClass={(!loadMemberData) ? 'hide-btn-send' : ''}
      />
    </Box>
  )
}

export default ConnectSlackTabUi
