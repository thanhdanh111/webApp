import { storiesOf } from '@storybook/react'
import React from 'react'
import DrawerUi from './drawer'

storiesOf('Footer', module).add('Footer', () => {
  return <DrawerUi
    isDrawerOpen={false}
    onChangeDrawerOpen={() => {
      //
    }}
  />
})
