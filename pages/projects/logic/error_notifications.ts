export function returnNotification({ resultInfo }) {
  const newResultInfo = resultInfo ?? { };

  switch (resultInfo?.type) {
    case 'succeed':
      newResultInfo['message'] = 'Update Channel Successfully';
      newResultInfo['status'] = 'success';
      break;
    case 'failed':
      newResultInfo['message'] = 'Error';
      newResultInfo['status'] = 'error';
      break;
  }

  return newResultInfo;
}
