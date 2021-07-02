import { Table, TableBody, TableContainer, Typography } from '@material-ui/core';
import { checkArray } from 'helpers/check_array';
import { HeadCell } from 'helpers/type';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import TableRowBase from './table_row';
import HeadTable from './head_table';
import { DisappearedLoading } from 'react-loadingg';

interface InitialProp {
  data: object[];
  length: number;
  loading: boolean;
  emptyState: boolean;
  fetchData: () => void;
  headCells: HeadCell[];
  hadExpandableRows: boolean;
  needCheckBox: boolean;
  renderAction: (data) => JSX.Element | undefined;
  actions: string[];
  ComponentDetail?: React.FunctionComponent;
  notFoundWarning?: string;
}

const TableContent = (props: InitialProp) => {

  const {
    data,
    length,
    loading,
    emptyState,
    fetchData,
    headCells,
    hadExpandableRows,
    needCheckBox,
    actions,
    renderAction,
    ComponentDetail,
    notFoundWarning,
  }: InitialProp = props;

  const emptyData = () => {
    if (emptyState) {
      return (
        <div className='empty-state'>
          <Typography color='textSecondary' className='empty-state--text'>{notFoundWarning}</Typography>
        </div>
      );
    }

    return;
  };

  return (
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
          {emptyData()}
          {
            loading && <div style={{ marginTop: '150px', marginBottom: '150px', display: 'flex', justifyContent: 'center' }}>
              <DisappearedLoading color={'#67cb48'} style={{ height: '100px' }}/>
            </div>
          }
      </TableContainer>
  );
};

export default (TableContent);
