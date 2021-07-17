import { storiesOf } from '@storybook/react'
import React from 'react'
import Layout from './pages_layout'

storiesOf('Footer', module).add('Footer', () => {
  return (
    <Layout children='' withoutPaths='' />
  )
})
