import { Box, TextField, Tooltip } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import moment, { Moment } from 'moment';
import React, { useState } from 'react';

interface InitProps {
  onChangeDate: (e) => void;
  title: string;
  minDateTime?: string | Moment;
  name?: string;
}

const DatetimeIconPicker: React.FC<InitProps> = (props) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [date, setDate] = useState('');

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
      <DateTimePicker
        open={openDatePicker}
        onOpen={() => setOpenDatePicker(true)}
        onClose={() => setOpenDatePicker(false)}
        value={date || moment()}
        onChange={(event) => {
          setDate(event?.toString() || '');
          props.onChangeDate({ name: props?.name, value: event });
        }}
        minDateTime={props.minDateTime || ''}
        renderInput={(propsDate) => (
          <TextField className='date-add' variant='outlined' {...propsDate} />
        )}
      />
    </>
  );
};

export default DatetimeIconPicker;
