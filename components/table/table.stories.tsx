import { storiesOf } from '@storybook/react'
import BaseTable from './table'

storiesOf('BaseTable', module).add('BaseTable', () => {
  return (
  <BaseTable
   headCells={[]}
   loading={true}
   data={[]}
   actions={[]}
   length={0}
   fetchData={() => {/**/}}
  />
  )
})
