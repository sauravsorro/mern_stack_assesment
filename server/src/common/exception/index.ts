import { HttpException, HttpStatus } from '@nestjs/common';

export const CustomError = {
  customException(message: any, errorCode: any): any {
    const error = errorCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    return new HttpException(
      {
        message: message || 'Internal Server Error',
        statusCode: error,
        data: {},
      },
      error,
    );
  },
};
