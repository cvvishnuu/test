import { BadRequestException } from '@nestjs/common';

export class InvalidDealerCodeException extends BadRequestException {
  constructor() {
    super('Invalid dealer code');
  }
}
