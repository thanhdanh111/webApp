import React, { FunctionComponent } from 'react';
import { FormControl, TextField } from '@material-ui/core';

interface DateTimePickerType {
  label: string;
  className?: string;
  type?: string;
  defaultValue?: string;
  name?: string;
  onChoosingValue: ({ event }) => void;
  error?: boolean;
}

type BodyProps = DateTimePickerType;

const DateAndTimePicker: FunctionComponent<BodyProps> = ({
  label,
  defaultValue= '',
  className = '',
  type = 'datetime-local',
  name= '',
  onChoosingValue,
  error = false,
}) => {

  return (
    <FormControl
      className={`date-time-picker--container ${className}`}
    >
      <TextField
        InputProps={{ disableUnderline: !error }}
        variant='standard'
        name={name ?? ''}
        label={label}
        error={error}
        onChange={(event) => onChoosingValue({ event })}
        type={type}
        defaultValue={defaultValue}
        className='date-time-picker--text-field'
        InputLabelProps={{
          shrink: true,
        }}
      />
    </FormControl>
  );
};

export default DateAndTimePicker;
