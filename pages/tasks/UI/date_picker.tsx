import { Box, TextField, Tooltip } from '@material-ui/core'
import { DatePicker } from '@material-ui/pickers'
import moment, { Moment } from 'moment'
import React, { useState } from 'react'

interface InitProps {
  onChangeDate: (e) => void
  title: string
  minDate?: string | Moment
  name?: string
}

const DateIconPicker: React.FC<InitProps> = (props) => {
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [date, setDate] = useState('')

  return (
    <>
      <Tooltip title={props.title} arrow={true} placement='top'>
        <Box className='icon-add' onClick={() => setOpenDatePicker(true)}>
          {date ? (
            <span className='date-text'>{moment(date).format('MMM Do')}</span>
          ) : (
            props.children
          )}
        </Box>
      </Tooltip>
      <DatePicker
        open={openDatePicker}
        onOpen={() => setOpenDatePicker(true)}
        onClose={() => setOpenDatePicker(false)}
        value={date}
        onChange={(event) => {
          setDate(event?.toString() || '')
          props.onChangeDate({ name: props?.name, value: event })
        }}
        minDate={props?.minDate || ''}
        renderInput={(propsDate) => (
          <TextField className='date-add' variant='outlined' {...propsDate} />
        )}
      />
    </>
  )
}

export default DateIconPicker
