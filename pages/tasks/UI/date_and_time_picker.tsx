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
  const [dateTime, setDateTime] = useState<Moment | string>('')

  const onGetDateTime = () => {
    setOpenDatePicker(false)

    if (!dateTime) {
      return
    }
    props.onChangeDate(dateTime)

  }

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
        onClose={onGetDateTime}
        value={props.date || props.minDateTime}
        onChange={(event) =>
          setDateTime(event || '')
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
