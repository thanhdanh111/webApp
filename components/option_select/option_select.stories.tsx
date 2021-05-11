import { storiesOf } from '@storybook/react';
import React from 'react';
import SelectOption from './option_select';

storiesOf('Footer', module).add('Footer', () => {
  return <SelectOption
    list={[]}
    value=''
    handleChange={() => {
        //
    }}
  />;
});
