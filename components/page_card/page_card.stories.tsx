import { storiesOf } from '@storybook/react'
import React from 'react'
import PageCardUi from './page_card'

storiesOf('Footer', module).add('Footer', () => {
  return (
    <PageCardUi references={['']} heading='' />
  )
})
