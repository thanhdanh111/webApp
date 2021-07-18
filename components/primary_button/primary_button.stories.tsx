import { storiesOf } from '@storybook/react'
import React from 'react'
import PrimaryButtonUI from './primary_button'
storiesOf('Footer', module).add('Footer', () => {
  return (
    <PrimaryButtonUI
        title=''
        handleClick={() => {
            //
        }}
    />
  )
})
