import { storiesOf } from '@storybook/react'
import Header from './header'

storiesOf('Header', module).add('Header', () => {
  return <Header changeDrawerOpen={() => null} />
})
