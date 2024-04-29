import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { createLogger, format } from 'winston';
import * as dailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, json } = format;

@Injectable()
export class LoggingService {
  private logger: winston.Logger;

  private options = {
    datePattern: 'YYYY-MM-DD',
    handleExceptions: true,
    json: false,
    zippedArchive: true,
    maxSize: '50m',
  };

  constructor() {
    const errorTransport = new dailyRotateFile({
      dirname: `logs/errorLogs`,
      filename: 'error-%DATE%.log',
      level: 'error',
      ...this.options,
    });

    const infoTransport = new dailyRotateFile({
      dirname: `logs/infoLogs`,
      filename: 'info-%DATE%.log',
      level: 'info',
      ...this.options,
    });

    this.logger = createLogger({
      format: combine(timestamp(), json()),
      transports: [errorTransport, infoTransport],
    });
  }

  log(message: string, level: string = 'info') {
    this.logger.log({ level, message });
  }

  logError(message: string) {
    this.logger.error(message);
  }
}
