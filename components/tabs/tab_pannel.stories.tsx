import { storiesOf } from '@storybook/react';
import React from 'react';
import TabPanel from './tab_pannel';

storiesOf('Footer', module).add('Footer', () => {
  return (
    <TabPanel
      key={`tab-pannel-${0}-account`}
      value={0}
      index={0}
    />
  );
});
