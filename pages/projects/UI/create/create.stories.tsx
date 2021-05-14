import { storiesOf } from '@storybook/react';
import React from 'react';
import CreateProject from './create';

storiesOf('Body Scripts', module).add('Body Scripts', () => {
  return (
    <>
      <CreateProject />
    </>
  );
});
