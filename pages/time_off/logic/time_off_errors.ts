export const propertyErrorMessages = (messages) => {
  let errors = [
    {
      message: 'Something went wrong',
      variant: 'error',
    },
  ];

  if (!messages || !messages?.length) {
    return errors;
  }

  if (typeof messages === 'string') {
    errors[0].message = messages;

    return errors;
  }

  errors = messages?.map((message) => {
    const messageNoti = {
      message: '',
      variant: 'error',
    };

    switch (message.property) {
      case 'startTime':
        messageNoti.message = 'Start time is wrong';
        break;
      case 'endTime':
        messageNoti.message = 'End time is wrong';
        break;
      case 'reason':
        messageNoti.message = 'Reason should be filled';
        break;
      case 'missingData':
        messageNoti.message = 'You should fill all required field';
        break;
      default:
        messageNoti.message = 'Something went wrong';
        break;
    }

    return messageNoti;
  });

  return errors;
};

export const handleTimeOffRequestErrors = ({ error, messageData }) => {
  let message = [
    {
      message: '',
      variant: 'error',
    },
  ];

  switch (error) {
    case 201:
      message[0].message = 'Sent your letter successfully';
      message[0].variant = 'success';
      break;
    case 400:
      message = propertyErrorMessages(messageData);
      break;
    case 401:
      message[0].message = 'Something went wrong with your account';
      break;
    case 403:
      message[0].message = 'You cannot use this functionality';
      break;
    default:
      message[0].message = 'Something went wrong';
      break;
  }

  return message;
};
