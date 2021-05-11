import { storiesOf } from '@storybook/react';
import React from 'react';
import HeadTable from './head_table';

storiesOf('BaseTable', module).add('BaseTable', () => {
  return (
  <HeadTable headCells={[]} needCheckBox={false}  />
  );
});
