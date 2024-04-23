import { BadRequestException } from '@nestjs/common';

export class InvalidPartOrModelIdException extends BadRequestException {
  constructor() {
    super('Invalid partId or modelId');
  }
}