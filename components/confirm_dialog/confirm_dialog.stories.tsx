import { storiesOf } from '@storybook/react'
import React from 'react'
import { ConfirmDialog } from './confirm_dialog'

storiesOf('ConfirmDialog', module).add('Footer', () => {
  return <ConfirmDialog
    onOpen={true}
    handleClose={() => 'handled'}
    handleNo={() => 'handled'}
    handleYes={() => 'handled'}
    status='CONTINUE'
  />
})
