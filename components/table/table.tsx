import {
    Paper,
} from '@material-ui/core'
import React from 'react'
import { HeadCell } from '../../helpers/type'
import TableContent from './table_content'

interface CustomizedCellsAtLastColumn {
  status?: string
  itemIndex?: number
}

interface InitialProps {
  headCells: HeadCell[]
  data: object[]
  length: number
  loading: boolean
  actions: string[]
  fetchData: () => void
  needCheckBox?: boolean
  redButtonName?: string
  actionFunc?: object
  baseTableName?: string
  loadingIndex?: string
  loadingStateName?: string
  indexLoading?: boolean
  notFoundAnyData?: boolean
  notFoundWarning?: string
  hadExpandableRows?: boolean
  needStickyHeader?: boolean
  fixedHeightInfiniteScroll?: number
  ComponentDetail?: React.FunctionComponent
  CustomizedCellAtLastColumn?: React.FunctionComponent<CustomizedCellsAtLastColumn>
}

const BaseTable = (props: InitialProps) => {
  const {
    headCells, data, length,
    loading,  actions, fetchData,
    needCheckBox = true, redButtonName,
    actionFunc, baseTableName,
    loadingIndex, loadingStateName, indexLoading,
    notFoundAnyData = false,
    notFoundWarning, hadExpandableRows = false,
    ComponentDetail, fixedHeightInfiniteScroll,
    needStickyHeader = true,
  }: InitialProps = props
  const emptyState = !loading && !data?.length && notFoundAnyData

  return (
    <Paper className='table-paper'>
      <TableContent
        data={data}
        length={length}
        loading={loading}
        emptyState={emptyState}
        fetchData={fetchData}
        headCells={headCells}
        hadExpandableRows={hadExpandableRows}
        needCheckBox={needCheckBox}
        actions={actions}
        ComponentDetail={ComponentDetail}
        notFoundWarning={notFoundWarning}
        fixedHeightInfiniteScroll={fixedHeightInfiniteScroll}
        needStickyHeader={needStickyHeader}
        redButtonName={redButtonName}
        actionFunc={actionFunc}
        baseTableName={baseTableName}
        loadingIndex={loadingIndex}
        loadingStateName={loadingStateName}
        indexLoading={indexLoading}
        CustomizedCellAtLastColumn={props.CustomizedCellAtLastColumn}
      />
    </Paper>
  )
}

export default BaseTable
