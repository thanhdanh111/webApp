import {
    Paper,
    Button,
    CircularProgress,
} from '@material-ui/core';
import React from 'react';
import { HeadCell } from '../../helpers/type';
import { checkArray } from 'helpers/check_array';
import { checkStringCondition } from 'helpers/check_string_condtion';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';
import TableContent from './table_content';

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
  hadExpandableRows?: boolean;
  ComponentDetail?: React.FunctionComponent;
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
    hadExpandableRows = false,
    ComponentDetail,
  }: InitialProps = props;
  const emptyState = !loading && !data?.length && notFoundAnyData;
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
        renderAction={renderAction}
        ComponentDetail={ComponentDetail}
        notFoundWarning={notFoundWarning}
      />
    </Paper>
  );
};

export default BaseTable;
