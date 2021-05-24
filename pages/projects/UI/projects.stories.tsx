import { storiesOf } from '@storybook/react';
import React from 'react';
import Projects from './projects';

storiesOf('Graph', module).add('Header', () => {
  return <>
    <Projects />
   </>;
});
