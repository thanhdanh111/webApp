import React from 'react'
import { Tabs, Tab, Typography } from '@material-ui/core'
import TabPanel from './tab_pannel'

const TabsUi = ({ tabs, tabIcons, tabUIs, currentTabIndex, handleChange }) => {

  return (
    <>
      <div className='tabs-container'>
        <Tabs value={currentTabIndex} onChange={handleChange} aria-label='account tabs'>
          {
            tabs.map((value, index) => {
              const TabIcon = tabIcons[index]
              const label =
              <>
                <div className='tab-label'>
                  <TabIcon className='label-icon' />
                  <Typography variant='body2' className='label-text'>{value}</Typography>
                </div>
              </>

              return <Tab
                key={`tab-key-${index}`}
                className={`tab-class-name-${index}`}
                label={label}
                disableRipple
              />
            })
          }
        </Tabs>
      </div>
      {tabUIs.map((TabUI, index) => (
        <TabPanel key={`tab-pannel-${index}-account`} value={currentTabIndex} index={index}>
          <TabUI />
        </TabPanel>
      ))}
    </>
  )
}

export default TabsUi
