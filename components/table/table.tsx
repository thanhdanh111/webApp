import {
    Table,
    TableBody,
    TableContainer,
    Paper,
    TableRow,
    TableCell,
    Checkbox,
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
import { BodyTable } from './body_table';
import { checkStringCondition } from 'helpers/check_string_condtion';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';

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
  individualActions?: string[];
  individualActionsRender?: object;
}

const BaseTable = (props: InitialProps) => {
  const {
    headCells, data, length,
    loading,  actions, fetchData,
    needCheckBox = true, redButtonName,
    actionFunc, baseTableName,
    loadingIndex, loadingStateName, indexLoading,
    notFoundAnyData = false,
    notFoundWarning, individualActions,
  }: InitialProps = props;
  const emptyState = !loading && !data?.length && notFoundAnyData;

  const tableCellContent = (content) => {
    if (Array.isArray(content)) {
      return (
        <ul className='cell-list'>
          {
            content.map((element, index) => <li className={`cell-item cell-item_${index}`} key={index} >{element}</li>)
          }
        </ul>
      );
    }

    return content;
  };

  function actionDefaultFunc({ itemIndex, action  }) {

    return { itemIndex, action };
  }

  const renderAction = ({ actionList, itemIndex, itemStatus, isManager }) => {

    if (!checkArray(actionList)) {
      return;
    }

    const notPendingStatus = checkStringCondition({
      variable: itemStatus,
      notEqualCondition: 'PENDING',
    });

    if (notPendingStatus || !isManager) {
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
          if (individualActions?.length && individualActions.includes(action)) {
            return <div />;
          }

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
    <Paper className='table-paper'>
      <TableContainer className='table-list'>
        <InfiniteScroll
          dataLength={data.length}
          hasMore={data.length < length}
          next={fetchData}
          loader={<div />}
          scrollThreshold={0.7}
          height={(emptyState || loading) ? 0 : 500}
        >
        <Table stickyHeader aria-label='sticky table' className='table-content' >
          <HeadTable needCheckBox={needCheckBox} headCells={headCells}/>
          { !loading &&  (checkArray(data) &&
          <TableBody className='table-body'>
                {data.map((item, index) => {
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} className='row-contain' key={index}>
                      {
                        needCheckBox && <TableCell padding='checkbox' className='cell-contain checkbox-cell'>
                          <Checkbox className='check'/>
                        </TableCell>
                      }
                      {headCells.map((header) => {
                        const nameStyle = (header.id === 'userName') ?  'name-style' : '';

                        const align = (header.numeric) ? 'right' : 'left';
                        const padding = (header.disablePadding) ? 'none' : 'default';

                        if (!item[header.id] && header.id !== 'action') {
                          return (
                            <BodyTable
                              key={header.id}
                              align={align}
                              padding={padding}
                            />
                          );
                        }

                        if (header.id === 'action') {
                          return (
                            <BodyTable
                              key={header.id}
                              content={
                                renderAction({
                                  actionList: actions,
                                  itemIndex: index,
                                  itemStatus: item['status'],
                                  isManager: item['isManager'],
                                })
                              }
                              align={align}
                              padding={padding}
                            />
                          );
                        }

                        return (
                            <BodyTable
                              key={header.id}
                              style={nameStyle}
                              content={tableCellContent(item[header.id])}
                              align={align}
                              padding={padding}
                            />
                        );
                      })}
                    </TableRow>
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
    </Paper>
  );
};

export default BaseTable;
