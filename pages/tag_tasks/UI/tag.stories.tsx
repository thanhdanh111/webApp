import { storiesOf } from '@storybook/react'
import React from 'react'
import TagTask from './tag'

storiesOf('Tag', module).add('Tag', () => {
  return (
    <TagTask selectedTag={[]} getSelectedTag={() => 'selected'}/>
  )
})
