import { storiesOf } from '@storybook/react';
import React from 'react';
import Auth from './auth';

storiesOf('Footer', module).add('Footer', () => {
  return <Auth children='' publicPages='' />;
});
