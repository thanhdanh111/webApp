import { storiesOf } from '@storybook/react';
import React from 'react';
import NotificationsUI from './notifications';

storiesOf('Header', module).add('Header', () => {
  return <NotificationsUI />;
});
