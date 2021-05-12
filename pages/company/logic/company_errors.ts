import { VariantType } from 'notistack';

interface AccountError {
  variant: VariantType;
  message: string;
}

export const handleCompanyErrors = ({ statusCode }): AccountError => {
  if (!statusCode) {
    return {
      variant: 'error',
      message: 'Something went wrong',
    };
  }

  switch (statusCode) {
    case 200:
      return {
        variant: 'success',
        message: 'Connect your slack token successfully',
      };
    default:
      return {
        variant: 'error',
        message: 'Something went wrong',
      };
  }
};
