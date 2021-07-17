import { storiesOf } from '@storybook/react'
import TimeOffNotificationContent from './time_off'

storiesOf('Time Off', module).add('Header', () => {
  return <TimeOffNotificationContent targetEntityName='' daysOffID='' />
})
