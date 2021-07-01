import { storiesOf } from '@storybook/react';
import React from 'react';
import ConfirmDialogDelete from './confirm_dialog_delete';

storiesOf('ConfirmDialog Scripts', module).add('ConfirmDialog Scripts', () => {
  return (
    <>
        <ConfirmDialogDelete open={false} handleDelete={() => ''} onClose={() => ''} />
    </>
  );
});
