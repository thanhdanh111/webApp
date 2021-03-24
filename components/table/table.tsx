import {
    Table,
    TableBody,
    TableContainer,
    Paper,
    TableRow,
    TableCell,
    Checkbox,
    Button,
} from '@material-ui/core';
import React from 'react';
import HeadTable from './head_table';
import { HeadCell } from '../../helpers/type';
import { checkArray } from 'helpers/check_array';
import { DisappearedLoading } from 'react-loadingg';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BodyTable } from './body_table';

interface InitialProps {
  headCells: HeadCell[];
  data: object[];
  length: number;
  loading: boolean;
  actions: string[];
  fetchData: () => void;
}

const BaseTable = (props: InitialProps) => {
  const { headCells, data, length, loading,  actions, fetchData }: InitialProps = props;

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

  const renderAction = (actionList) => {

    if (!checkArray(actionList)) {
      return;
    }

    return (
      <ul className='list-action'>
        {actionList.map((action, index) => {

          const colorButton = (action.toUpperCase() === 'DELETE') ? 'redButton' : '';

          return (
            <li className='action-item' key={index}>
              <Button className={`${colorButton} action`}>{action}</Button>
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
          hasMore={data.length < length ? true : false}
          next={fetchData}
          scrollThreshold={0.7}
          loader={<div/>}
          height={500}
        >
        <Table stickyHeader aria-label='sticky table' className='table-content' >
          <HeadTable headCells={headCells}/>
          { !loading &&  (checkArray(data) &&
          <TableBody className='table-body'>
                {data.map((item, index) => {
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} className='row-contain' key={index}>
                      <TableCell padding='checkbox' className='cell-contain checkbox-cell'>
                        <Checkbox className='check'/>
                      </TableCell>
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
                              content={renderAction(actions)}
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
      </TableContainer>
      <div className='item__table'>
        {loading && <DisappearedLoading color={'#67cb48'}/>}
      </div>
    </Paper>
  );
};

export default BaseTable;
