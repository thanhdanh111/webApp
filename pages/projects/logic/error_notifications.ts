export function returnNotification({ type }) {
  let newResultInfo = '';
  switch (type) {
    case 'succeedUpdateChannel':
      newResultInfo = 'Update Channel Successfully';
      break;
    case 'failedUpdateChannel':
      newResultInfo = 'Failed Update Channel';
      break;
    case 'errorFailed':
      newResultInfo = 'Error data. Please update slack token!';
      break;
    case 'succeedCreateProject':
      newResultInfo = 'Create Project Successfully';
      break;
    case 'failedCreateProject':
      newResultInfo = 'Error. Failed Create Project';
      break;
    case 'companyTokenNotification':
      newResultInfo = 'You have not registered any companies for workspace';
      break;
    case 'token':
      newResultInfo = 'Please check your token';
      break;
  }

  return newResultInfo;
}
