import React from 'react';
import {
    Checkbox,
    TableHead,
    TableRow,
    TableCell,
} from '@material-ui/core';
import { checkIfEmptyArray } from 'helpers/check_if_empty_array';
import { HeadCell } from 'helpers/type';

interface PropsInitial {
  headCells: HeadCell[];
  needCheckBox: boolean;
  hadExpandableRows: boolean;
}

const HeadTable = (props: PropsInitial) => {
  const { headCells, needCheckBox = true, hadExpandableRows = false }: PropsInitial = props;

  return (
    <TableHead className='table-users'>
        <TableRow className='table-head'>
          {
           needCheckBox && (<TableCell padding='checkbox' className='cell-title box-head' align='right'>
            <Checkbox
              inputProps={{ 'aria-label': 'select all desserts' }}
              className='checkbox-header'
            />
          </TableCell>)
          }
          {hadExpandableRows && <TableCell style={{ border: 'none' }} />}
          {(checkIfEmptyArray(headCells)) &&
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
