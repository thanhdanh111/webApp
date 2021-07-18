import { storiesOf } from '@storybook/react'
import React from 'react'
import TabsUi from './tabs'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import VpnKeyIcon from '@material-ui/icons/VpnKey'

const tabs = ['general', 'change password']
const tabIcons = [AccountBoxIcon, VpnKeyIcon]
const tabUIs = [<div key='story 1' />, <div key='story 2' />]

storiesOf('Footer', module).add('Footer', () => {
  return (
    <TabsUi
      tabs={tabs}
      currentTabIndex={0}
      tabIcons={tabIcons}
      tabUIs={tabUIs}
      handleChange={() => {
        //
      }}
    />
  )
})
