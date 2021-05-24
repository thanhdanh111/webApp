import { DialogContent } from '@material-ui/core';
import React from 'react';
import  TimeOffNotificationContent  from '../pages/time_off/UI/notification_content/time_off';
import { targetEntityName } from 'constants/check_type_target_entity_name';

export const getEntityName = (props) => {
  const targetEntityValue: string = targetEntityName[props.targetEntityName];
  switch (targetEntityValue) {
    case targetEntityName.DAY_OFFS:
      return (
        <DialogContent className='notification-detail-content'>
          <TimeOffNotificationContent daysOffID={props.targetID} targetEntityName={targetEntityValue} />
        </DialogContent>
      );
    case targetEntityName.TASKS:
      return (
         <div>This is click up</div>
      );
  }
};
