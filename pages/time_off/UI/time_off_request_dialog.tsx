import React, { FunctionComponent, useEffect } from 'react'
import { IconButton, TextField, Typography, Button, Dialog } from '@material-ui/core'
import DialogContent from '@material-ui/core/DialogContent'
import { Close } from '@material-ui/icons'
import MarkunreadIcon from '@material-ui/icons/Markunread'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'redux/reducers_registration'
import DateAndTimePicker from '@components/date_time_picker/date_time_picker'
import { OptionsSelect } from '@components/options_select/options_select'
import { TimeOffRequestProps } from 'pages/time_off/logic/time_off_interface'
import { updateContentLetter } from 'pages/time_off/logic/time_off_actions'
import { submitTimeOffRequest, getDepartmentsAndCompanies } from 'pages/time_off/logic/time_off_apis'
import moment from 'moment'
import { checkOnlyTrueInArray } from 'helpers/check_only_true'

const TimeOffRequetDialog: FunctionComponent = () => {
  const dispatch = useDispatch()
  const selectedContent = { }
  const {
    companies,
    onRequest,
    onSendingRequest,
    selectedCompany,
    startDate,
    endDate,
    startTime,
    endTime,
    reason,
  }: TimeOffRequestProps = useSelector((state : RootState) => state.timeOffRequest)
  const access = useSelector((state: RootState) => state?.userInfo?.access)
  const unixStartDateAndTime = moment(`${startDate}T${startTime}`).unix()
  const unixEndDateAndTime = moment(`${endDate}T${endTime}`).unix()
  const currentDate = moment().format('YYYY-MM-DD')
  const isStartDateBeforeCurrent = moment(startDate).isBefore(currentDate)
  const isEndDateBeforeCurrent = moment(endDate).isBefore(startDate)
  const isStartTimeAfterCurrent =  unixStartDateAndTime > moment().unix()
  const isEndTimeAfterStartTime =  unixEndDateAndTime > unixStartDateAndTime

  const couldSubmit = checkOnlyTrueInArray({
    conditionsArray: [
      !!selectedCompany,
      !!selectedCompany?.companyID,
      !!reason,
      !isStartDateBeforeCurrent,
      !isEndDateBeforeCurrent,
      isStartTimeAfterCurrent,
      isEndTimeAfterStartTime,
      !onSendingRequest,
    ],
  })

  useEffect(() => {
    dispatch(getDepartmentsAndCompanies())
  }, [access])

  const firstOptions = companies?.map((company, index) =>
    <option
      key={index}
      value={company?.companyID}
    >
     {company?.name}
    </option>,
  )

  const secondOptions = selectedCompany?.departments?.map((department, index) =>
    <option
      key={index}
      value={department?.departmentID}
    >
    {department.name}
    </option>,
  )

  const undefinedOption = <option key='none' value='none'>None</option>

  function handleFillingInfo({ event }) {
    const stateName = event.target.name
    const index = event.target.selectedIndex - 1

    selectedContent[stateName] = event.target.value

    switch (stateName) {
      case 'selectedCompany':
        if (index < 0) {
          selectedContent[stateName] = undefined

          break
        }

        selectedContent[stateName] = companies?.[index]
        break
      case 'selectedDepartment':
        if (index < 0) {
          selectedContent[stateName] = undefined

          break
        }

        selectedContent[stateName] = selectedCompany?.departments?.[index]
        break
    }

    dispatch(updateContentLetter({ selectedContent }))
  }

  function handleOpenOrClose() {
    if (onRequest) {
      selectedContent['selectedDepartment'] = undefined
      selectedContent['reason'] = ''
    }

    selectedContent['onRequest'] = !onRequest
    dispatch(updateContentLetter({ selectedContent }))
  }

  function onSubmitTimeOffRequest() {
    dispatch(submitTimeOffRequest())
  }

  return (
    <>
      <IconButton className='request-time-off-btn' onClick={handleOpenOrClose}>
          <MarkunreadIcon className='btn-appbar' color={onRequest ? 'primary' : 'secondary'}/>
      </IconButton>

      <Dialog
        classes={{ paper: 'dialog-paper' }}
        fullWidth
        maxWidth='md'
        open={onRequest}
        onClose={handleOpenOrClose}
      >
        <IconButton className='dialog-close-button' onClick={handleOpenOrClose}>
          <Close />
        </IconButton>
        <DialogContent>
         <div className='request-dialog-content'>
           <Typography component='h3' variant='h5' className='request-dialog-content--title'>
              Time Off Letter
            </Typography>

          <div className='pick-date-time-content-dialog--row'>
            <DateAndTimePicker
              name='startDate'
              className='start-date'
              label='Start Date'
              type='date'
              error={isStartDateBeforeCurrent}
              onChoosingValue={handleFillingInfo}
              value={startDate}
            />
            <DateAndTimePicker
              name='startTime'
              className='start-time'
              label='Start Time'
              type='time'
              error={!isStartTimeAfterCurrent}
              onChoosingValue={handleFillingInfo}
              value={startTime}
            />
            <OptionsSelect
              options={[
                undefinedOption,
                ...(firstOptions ?? []),
              ]}
              inputLabel='Company'
              handleFillingInfo={handleFillingInfo}
              formName='selectedCompany'
              disabled={companies?.length < 2}
              defaultValue={selectedCompany?.companyID}
            />
            <DateAndTimePicker
              name='endDate'
              className='end-date'
              label='End Date'
              type='date'
              error={isEndDateBeforeCurrent}
              onChoosingValue={handleFillingInfo}
              value={endDate}
            />
            <DateAndTimePicker
              name='endTime'
              className='end-time'
              label='End Time'
              type='time'
              error={!isEndTimeAfterStartTime}
              onChoosingValue={handleFillingInfo}
              value={endTime}
            />
            <OptionsSelect
              options={[undefinedOption, ...(secondOptions ?? [])]}
              inputLabel='Department'
              handleFillingInfo={handleFillingInfo}
              formName='selectedDepartment'
            />
          </div>

          <div className='request-dialog-content--input-label' >Reason<span className='required-label'>*</span></div>
          <TextField
            name='reason'
            value={reason}
            margin='normal'
            fullWidth
            id='outlined-multiline-static'
            multiline
            rows={5}
            variant='outlined'
            onChange={(event) => handleFillingInfo({ event })}
          />
         </div>

          <Button
            disabled={!couldSubmit}
            size='large'
            type='submit'
            fullWidth
            variant='contained'
            color='secondary'
            className='dialog--submit-btn'
            onClick={onSubmitTimeOffRequest}
          >
            {onSendingRequest ? 'Sending your letter' : 'Submit'}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TimeOffRequetDialog
