import { storiesOf } from '@storybook/react';
import React from 'react';
import CompanyDetailTab from './company_detail';

storiesOf('Connect Slack Tab', module).add('Header', () => {
  return <> <CompanyDetailTab /> </>;
});
