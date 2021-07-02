import { storiesOf } from '@storybook/react';
import React from 'react';
import { BodyTable } from './body_table';

storiesOf('BaseTable', module).add('BaseTable', () => {
  return (
    <BodyTable  />
  );
});
