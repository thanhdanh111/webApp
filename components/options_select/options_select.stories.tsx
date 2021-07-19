import { storiesOf } from '@storybook/react'
import React from 'react'
import { OptionsSelect } from './options_select'

storiesOf('Footer', module).add('Footer', () => {
  return (
    <OptionsSelect
        options={[]}
        formName=''
        handleFillingInfo={() => {
            //
        }}
    />
  )
})
