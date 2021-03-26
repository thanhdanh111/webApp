export function returnNotification({ resultInfo }) {
  const newResultInfo = resultInfo ?? { };

  switch (resultInfo?.status) {
    case 'succeed':
      newResultInfo['message'] = `Invited ${resultInfo?.email ?? ''} Successfully`;
      newResultInfo['status'] = 'success';
      break;
    case 'failed':
      newResultInfo['message'] = `${resultInfo?.email ?? ''}: ${resultInfo?.message ?? ''}`;
      newResultInfo['status'] = 'error';
      break;
    case 'failedConnection':
      newResultInfo['status'] = 'error';
      break;
    case '403':
      newResultInfo['message'] = 'You don\'t have permission to invite';
      newResultInfo['status'] = 'error';
      break;
    default:
      newResultInfo['message'] = 'Something went wrong';
      newResultInfo['status'] = 'error';
  }

  return newResultInfo;
}
