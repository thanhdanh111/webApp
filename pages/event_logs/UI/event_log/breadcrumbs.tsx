import BaseTable from '@components/table/table';
import { Typography } from '@material-ui/core';
import { HeadCell } from 'helpers/type';
import { BreadcrumbState } from 'pages/event_logs/logic/event_log_interface';
import React, { FunctionComponent } from 'react';

export const headCells: HeadCell[] = [
    { id: 'category', numeric: false, disablePadding: true, label: 'Category' },
    { id: 'description', numeric: false, disablePadding: true, label: 'Description' },
    { id: 'level', numeric: false, disablePadding: true, label: 'Level' },
    { id: 'time', numeric: false, disablePadding: true, label: 'Time' },
];

interface InitialProps {
  breadcrumbs: BreadcrumbState[];
  loading: boolean;
}

type BreadcrumbsType = InitialProps;

const BreadcrumbsTable: FunctionComponent<BreadcrumbsType> = (props: InitialProps) => {

  const { breadcrumbs, loading }: InitialProps = props;

  return (
    <div className='breadcrumbs'>
        <Typography className='breadcrumbs-title'>BREADCRUMBS</Typography>
        <BaseTable
          needCheckBox={false}
          headCells={headCells}
          data={breadcrumbs}
          length={breadcrumbs.length}
          loading={loading}
          actions={[]}
          fetchData={() => {
              //
          }}
        />
    </div>
  );
};

export default (BreadcrumbsTable);
