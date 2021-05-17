import { storiesOf } from '@storybook/react';
import React from 'react';
import BreadcrumbsTable from './breadcrumbs';

storiesOf('Body Scripts', module).add('Body Scripts', () => {
  return (
    <>
      <BreadcrumbsTable loading breadcrumbs={[]} />
    </>
  );
});
