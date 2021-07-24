import { Box, TextField, Tooltip } from '@material-ui/core'
import { DateTimePicker } from '@material-ui/pickers'
import moment, { Moment } from 'moment'
import React, { useState } from 'react'

interface InitProps {
  onChangeDate: (e) => void
  title: string
  minDateTime?: string | Moment
  date?: string
}

const DatetimeIconPicker: React.FC<InitProps> = (props) => {
  const [openDatePicker, setOpenDatePicker] = useState(false)

  return (
    <div className='date-time-picker'>
      <Tooltip title={props.title} arrow={true} placement='top'>
        <Box className='icon-add' onClick={() => setOpenDatePicker(true)}>
          {props.date ? (
            <span className='date-text'>{moment(props.date).format('MMM Do')}</span>
          ) : (
            props.children
          )}
        </Box>
      </Tooltip>
      <DateTimePicker
        open={openDatePicker}
        onOpen={() => setOpenDatePicker(true)}
        onClose={() => setOpenDatePicker(false)}
        value={props.date || moment()}
        onChange={(event) =>
          props.onChangeDate(event)
        }
        minDateTime={props.minDateTime || ''}
        renderInput={(propsDate) => (
          <TextField className='date-add' variant='outlined' {...propsDate} />
        )}
      />
    </div>
  )
}

export default DatetimeIconPicker
