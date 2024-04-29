import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoggingService } from '../logger/logging.service';
import { EXCEPTION_MESSAGE } from '../shared/constants/constants';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const request: Request = context.switchToHttp().getRequest();

    const { method, url } = request;

    this.loggingService.log(
      `[${method}] ${url} ${context.getClass().name} ${context.getHandler().name} invoked`,
    );

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();

        const { statusCode } = response;

        const elapsedTime = Date.now() - now;

        this.loggingService.log(
          `[${method}] ${url} - ${statusCode} - ${elapsedTime}ms, Response data: ${JSON.stringify(data)}`,
        );
      }),
      catchError((error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : EXCEPTION_MESSAGE.UNKNOWN_ERROR;

        this.loggingService.logError(
          `[${method}] ${url} ${context.getClass().name} ${context.getHandler().name} - ${errorMessage}`,
        );

        return throwError(() => error);
      }),
    );
  }
}
