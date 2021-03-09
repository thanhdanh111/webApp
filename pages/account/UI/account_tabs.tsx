import React, { useState } from 'react';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { Tabs, Tab, Typography } from '@material-ui/core';
import PasswordTabUi from './password_tab';
import GeneralTabUi from './general_tab';

const tabs = ['general', 'change password'];
const tabIcons = [AccountBoxIcon, VpnKeyIcon];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number | string;
  value: number | string;
}

type TabPanelType = TabPanelProps;

const TabPanel = (props: TabPanelType) => {
  const { value, index, children }: TabPanelType = props;

  return (
    <div
      key={`tab-panel-${index}`}
      className='tab-pannel'
      hidden={value !== index}
    >
      {value === index && children}
    </div>
  );
};

const AccountTabsUi = () => {
  const [currentTab, setCurrentTab] = useState(0);

  function a11yProps(index: number | string) {
    return {
      id: `tab-id-${index}`,
      'aria-controls': `tab-panel-${index}`,
    };
  }

  function handleChange(_: React.ChangeEvent<{}>, newValue: number) {
    setCurrentTab(newValue);
  }

  return (
    <>
      <div className='account-tabs-container'>
        <Tabs value={currentTab} onChange={handleChange} aria-label='account tabs'>
          {
            tabs.map((value, index) => {
              const TabIcon = tabIcons[index];
              const label =
              <>
                <div className='tab-label'>
                  <TabIcon className='label-icon' />
                  <Typography variant='body2' className='label-text'>{value}</Typography>
                </div>
              </>;

              return <Tab
                key={`tab-key-${index}`}
                label={label}
                disableRipple
                {...a11yProps(index)}
              />;
            })
          }
        </Tabs>
      </div>
      <TabPanel value={currentTab} index={0}>
        <GeneralTabUi />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <PasswordTabUi />
      </TabPanel>
    </>
  );
};

export default AccountTabsUi;
