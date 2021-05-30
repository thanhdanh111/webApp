import { storiesOf } from '@storybook/react';
import React from 'react';
import { ConfirmDialog } from './confirm_dialog';

storiesOf('Footer', module).add('Footer', () => {
  return <ConfirmDialog
    onOpen={true}
    handleClose={() => 'handled'}
    handleNo={() => 'handled'}
    handleYes={() => 'handled'}
    status='CONTINUE'
  />;
});
