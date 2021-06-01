import {
    Table,
    TableBody,
    TableContainer,
    Button,
    CircularProgress,
    Typography,
} from '@material-ui/core';
import React from 'react';
import HeadTable from './head_table';
import { HeadCell } from '../../helpers/type';
import { checkArray } from 'helpers/check_array';
import { DisappearedLoading } from 'react-loadingg';
import InfiniteScroll from 'react-infinite-scroll-component';
import { checkStringCondition } from 'helpers/check_string_condtion';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';
import TableRowBase from './table_row';

interface UseOutsideReturnAction {
  status?: string;
  itemIndex?: number;
}

interface InitialProps {
  headCells: HeadCell[];
  data: object[];
  length: number;
  loading: boolean;
  actions: string[];
  fetchData: () => void;
  needCheckBox?: boolean;
  redButtonName?: string;
  actionFunc?: object;
  baseTableName?: string;
  loadingIndex?: string;
  loadingStateName?: string;
  indexLoading?: boolean;
  notFoundAnyData?: boolean;
  notFoundWarning?: string;
  hadExpandableRows?: boolean;
  ComponentDetail?: React.FunctionComponent;
  UseOutsideReturnAction?: React.FunctionComponent<UseOutsideReturnAction>;
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
    ComponentDetail,
  }: InitialProps = props;
  const emptyState = !loading && !data?.length && notFoundAnyData;
  function actionDefaultFunc({ itemIndex, action  }) {

    return { itemIndex, action };
  }

  const renderAction = ({
    actionList,
    itemIndex,
    itemStatus,
    isManager,
  }) => {
    if (!actionList?.length) {
      return;
    }

    if (props?.UseOutsideReturnAction) {
      const Element = props?.UseOutsideReturnAction;

      return  <Element status={itemStatus} itemIndex={itemIndex}/>;
    }

    const notPendingStatus = checkStringCondition({
      variable: itemStatus,
      notEqualCondition: 'PENDING',
    });

    if (itemStatus && (notPendingStatus || !isManager)) {
      return <div />;
    }

    const equalLoadingStateName = checkStringCondition({
      variable: loadingStateName,
      equalCondition: baseTableName,
    });
    const loadingActionAtIndex = checkOnlyTrueInArray({
      conditionsArray: [
        equalLoadingStateName,
        indexLoading,
        loadingStateName,
        typeof loadingIndex === 'number',
        loadingIndex === itemIndex,
      ],
    });

    if (loadingActionAtIndex) {
      return <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress disableShrink  style={{ width: '30px', height: '30px' }} />
      </div>;
    }

    return (
      <ul className='list-action'>
        {actionList.map((action, index) => {
          const colorButton = (action.toUpperCase() === 'DELETE' || action.toUpperCase() === redButtonName) ? 'redButton' : '';
          const func = actionFunc?.[action] ?? actionDefaultFunc;

          return (
            <li className='action-item' key={index}>
              <Button
                variant='contained'
                color='secondary'
                className={`${colorButton} action`}
                onClick={() => func({  itemIndex, baseTableName, timeOffID: data?.[itemIndex]?.['id'] })}
              >
                {action}
              </Button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className='table-paper'>
      <TableContainer className='table-list'>
        <InfiniteScroll
          dataLength={data.length}
          hasMore={data.length < length}
          next={fetchData}
          loader={<div />}
          scrollThreshold={0.7}
        >
        <Table stickyHeader aria-label='sticky table' className='table-content' >
          <HeadTable headCells={headCells} needCheckBox={needCheckBox} hadExpandableRows={hadExpandableRows}/>
          { !loading &&  (checkArray(data) &&
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
                  );
                })}
          </TableBody>
        )}
        </Table>
        </InfiniteScroll>
          {
            emptyState &&
            <div className='empty-state'>
              <Typography color='textSecondary' className='empty-state--text'>{notFoundWarning}</Typography>
            </div>
          }
          {
            loading && <div style={{ marginTop: '150px', marginBottom: '150px', display: 'flex', justifyContent: 'center' }}>
              <DisappearedLoading color={'#67cb48'} style={{ height: '100px' }}/>
            </div>
          }
      </TableContainer>
    </div>
  );
};

export default BaseTable;
