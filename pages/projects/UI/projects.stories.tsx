import { storiesOf } from '@storybook/react';
import React from 'react';
import Projects from './projects';

storiesOf('Projects', module).add('Body', () => {
  return <>
    <Projects />
  </>;
});
