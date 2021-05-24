import { storiesOf } from '@storybook/react';
import React from 'react';
import CreateProject from './create';

storiesOf('Create Projects', module).add('Project', () => {
  return <>
    <CreateProject />
  </>;
});
