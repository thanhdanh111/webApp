import React from 'react';
import {
    Checkbox,
    TableHead,
    TableRow,
    TableCell,
} from '@material-ui/core';
import { checkArray } from 'helpers/check_array';
import { HeadCell } from 'helpers/type';

interface PropsInitial {
  headCells: HeadCell[];
}

const HeadTable = (props: PropsInitial) => {
  const { headCells }: PropsInitial = props;

  return (
    <TableHead className='table-users'>
        <TableRow className='table-head'>
          <TableCell padding='checkbox' className='cell-title box-head' align='right'>
            <Checkbox
              inputProps={{ 'aria-label': 'select all desserts' }}
              className='checkbox-header'
            />
          </TableCell>
          {(checkArray(headCells)) &&
          headCells.map((header) => (
                <TableCell
                    key={header.id}
                    align={header.numeric ? 'right' : 'left'}
                    padding={header.disablePadding ? 'none' : 'default'}
                    className='cell-title'
                >
                {header.label}
                </TableCell>
          ))}
        </TableRow>
      </TableHead>

  );
};

export default (HeadTable);
