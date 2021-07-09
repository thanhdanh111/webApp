import { storiesOf } from '@storybook/react';
import React from 'react';
import CreateBoard from './create_board';

storiesOf('NewBoard Scripts', module).add('NewBoard Scripts', () => {
  return (
    <>
      <CreateBoard />
    </>
  );
});
