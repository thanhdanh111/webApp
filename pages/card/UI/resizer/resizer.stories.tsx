import React from 'react'
import Resizer from './resize'
import { storiesOf } from '@storybook/react'

storiesOf('Resize Scripts', module).add('Resize Scripts', () => {
  return (
    <>
        <Resizer id onResize panelRef/>
    </>
  )
})
