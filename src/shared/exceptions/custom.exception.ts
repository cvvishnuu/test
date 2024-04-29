import { BadRequestException } from '@nestjs/common';
import { EXCEPTION_MESSAGE } from '../constants/constants';

export class InvalidDealerCodeException extends BadRequestException {
  constructor() {
    super(EXCEPTION_MESSAGE.INVALID_DEALER_CODE);
  }
}

export class DatabaseException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseException';
  }
}

export class InvalidPartOrModelIdException extends BadRequestException {
  constructor() {
    super(EXCEPTION_MESSAGE.INVALID_PARTID_MODELID);
  }
}
