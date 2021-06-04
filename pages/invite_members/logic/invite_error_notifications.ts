export function returnNotification({ type, email, message }: { type: string, email?: string, message?: string}) {
  const newResultInfo = {};

  switch (type) {
    case 'succeed':
      newResultInfo['message'] = `Invited ${email ?? ''} Successfully`;
      newResultInfo['status'] = 'success';
      break;
    case 'failed':
      newResultInfo['message'] = `${email ?? ''}: ${message ?? ''}`;
      newResultInfo['status'] = 'error';
      break;
    case 'invalidEmail':
      newResultInfo['message'] = `${email ?? ''}: invalid Email`;
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
