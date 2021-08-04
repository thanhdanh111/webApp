import PageCardUi from '@components/page_card/page_card'
import React from 'react'
import GeneralTabUi from './UI/general_tab'

const AccountPage = () => {

  return <div className='account-page'>
    <PageCardUi heading='Account' />
    <GeneralTabUi />
  </div>
}

export default AccountPage
