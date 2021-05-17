import { storiesOf } from '@storybook/react';
import React from 'react';
import Issues from './issues';

storiesOf('Body Scripts', module).add('Body Scripts', () => {
  return (
    <>
      <Issues loading eventLogs={[]}/>
    </>
  );
});
