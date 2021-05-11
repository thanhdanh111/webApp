import { storiesOf } from '@storybook/react';
import React from 'react';
import DateAndTimePicker from './date_time_picker';

storiesOf('Footer', module).add('Footer', () => {
  return <DateAndTimePicker
    label=''
    onChoosingValue={({ }) =>  {
        //
    }}
  />;
});
