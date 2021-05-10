import { storiesOf } from '@storybook/react';
import React from 'react';
import DocsPage from '../index.page';

storiesOf('Account', module).add('Header', () => {
  return <DocsPage />;
});
