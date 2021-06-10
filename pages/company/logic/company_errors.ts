import { VariantType } from 'notistack';

interface CompanyNotification {
  variant: VariantType;
  message: string;
}

export const handleEmptyField = ({ contentFields }): CompanyNotification => {
  for (const field in contentFields) {
    if (contentFields[field]) {
      continue;
    }

    switch (field) {
      case 'companyID':
        return {
          variant: 'error',
          message: 'You have not registered any companies for workspace',
        };
      case 'slackToken':
        return {
          variant: 'error',
          message: 'You should fill your token',
        };
    }
  }

  return {
    variant: 'error',
    message: 'Something went wrong',
  };
};
