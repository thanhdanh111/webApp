import { storiesOf } from '@storybook/react'
import React from 'react'
import ConnectSlackTabUi from './connect_slack_tab'

storiesOf('Connect Slack Tab', module).add('Header', () => {
  return <> <ConnectSlackTabUi /> </>
})
