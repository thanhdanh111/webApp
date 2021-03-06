import { Button, CircularProgress, Table, TableBody, TableContainer, Typography } from '@material-ui/core'
import { checkIfEmptyArray } from 'helpers/check_if_empty_array'
import { HeadCell } from 'helpers/type'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import TableRowBase from './table_row'
import HeadTable from './head_table'
import { DisappearedLoading } from 'react-loadingg'
import { checkStringCondition } from 'helpers/check_string_condtion'
import { checkOnlyTrueInArray } from 'helpers/check_only_true'

interface CustomizedCellsAtLastColumn {
  status?: string
  itemIndex?: number
}

interface InitialProp {
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
  emptyState?: boolean
  notFoundWarning?: string
  hadExpandableRows?: boolean
  needStickyHeader?: boolean
  fixedHeightInfiniteScroll?: number
  ComponentDetail?: React.FunctionComponent
  CustomizedCellAtLastColumn?: React.FunctionComponent<CustomizedCellsAtLastColumn>
}

const TableContent = (props: InitialProp) => {

  const {
    headCells, data, length,
    loading,  actions, fetchData,
    needCheckBox = true, redButtonName,
    actionFunc, baseTableName,
    loadingIndex, loadingStateName, indexLoading,
    hadExpandableRows = false, emptyState,
    ComponentDetail, fixedHeightInfiniteScroll,
    needStickyHeader = true, notFoundWarning,
  }: InitialProp = props

  const emptyData = () => {
    if (emptyState) {
      return (
        <div className='empty-state'>
          <Typography color='textSecondary' className='empty-state-table--text'>{notFoundWarning}</Typography>
        </div>
      )
    }

    return
  }

  function actionDefaultFunc({ itemIndex, action  }) {

    return { itemIndex, action }
  }

  const renderAction = ({
    actionList,
    itemIndex,
    itemStatus,
    isManager,
  }) => {
    if (props?.CustomizedCellAtLastColumn) {
      const CellAtLastColumn = props?.CustomizedCellAtLastColumn

      return  <CellAtLastColumn status={itemStatus} itemIndex={itemIndex}/>
    }

    const notPendingStatus = checkStringCondition({
      variable: itemStatus,
      notEqualCondition: 'PENDING',
    })

    if (itemStatus && (notPendingStatus || !isManager)) {
      return <div />
    }

    const equalLoadingStateName = checkStringCondition({
      variable: loadingStateName,
      equalCondition: baseTableName,
    })
    const loadingActionAtIndex = checkOnlyTrueInArray({
      conditionsArray: [
        equalLoadingStateName,
        indexLoading,
        loadingStateName,
        typeof loadingIndex === 'number',
        loadingIndex === itemIndex,
      ],
    })

    if (loadingActionAtIndex) {
      return <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress disableShrink  style={{ width: '30px', height: '30px' }} />
      </div>
    }

    return (
      <div className='list-action'>
        {actionList.map((action, index) => {
          const colorButton = (action.toUpperCase() === 'DELETE' || action.toUpperCase() === redButtonName) ? 'redButton' : ''
          const func = actionFunc?.[action] ?? actionDefaultFunc

          return (
            <div className='action-item' key={index}>
              <Button
                variant='contained'
                color='secondary'
                className={`${colorButton} action`}
                onClick={() => func({  itemIndex, baseTableName, timeOffID: data?.[itemIndex]?.['id'] })}
              >
                {action}
              </Button>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <TableContainer className='table-list'>
        <InfiniteScroll
          dataLength={data.length}
          hasMore={data.length < length}
          next={fetchData}
          loader={<div />}
          scrollThreshold={0.7}
          height={fixedHeightInfiniteScroll}
        >
        <Table stickyHeader={needStickyHeader} aria-label='sticky table' className='table-content' >
          <HeadTable headCells={headCells} needCheckBox={needCheckBox} hadExpandableRows={hadExpandableRows}/>
          { !loading &&  (checkIfEmptyArray(data) &&
          <TableBody className='table-body'>
                {data.map((item, index) => {
                  return (
                    <TableRowBase
                      key={index}
                      hadExpandableRows={hadExpandableRows}
                      headCells={headCells}
                      needCheckBox={needCheckBox}
                      renderAction={renderAction}
                      item={item}
                      actions={actions}
                      index={index}
                      ComponentDetail={ComponentDetail}
                    />
                  )
                })}
          </TableBody>
        )}
        </Table>
        </InfiniteScroll>
          {emptyData()}
          {
            loading && <DisappearedLoading color={'#67cb48'} />
          }
      </TableContainer>
  )
}

export default (TableContent)
