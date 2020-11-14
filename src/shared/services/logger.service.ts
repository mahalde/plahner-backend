import * as winston from 'winston';
import { isProdMode } from '../utils';

const { combine, timestamp, printf, colorize, prettyPrint } = winston.format;

export class LoggerService {
  private readonly logger: winston.Logger;

  constructor(readonly serviceName: string) {
    this.logger = winston.createLogger({
      level: isProdMode() ? 'info' : 'debug',
      format: combine(timestamp(), prettyPrint()),
      defaultMeta: { service: serviceName },
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });

    const consoleFormat: winston.Logform.Format = printf(o => {
      const hasError = o.level === 'error';
      return `${o.level.toUpperCase().padEnd(6)} [${process.pid}] ${
        o.timestamp
      } - [${o.service}] ${o.message} ${hasError ? '\n' + o.stack : ''}`;
    });

    if (!isProdMode()) {
      this.logger.add(
        new winston.transports.Console({
          format: combine(
            colorize({ message: true }),
            timestamp(),
            consoleFormat,
          ),
        }),
      );
    }
  }

  public info(message: any, obj?: any) {
    this.logger.info(message, obj);
  }

  public warn(message: any, error?: Error) {
    this.logger.warn(message, error);
  }

  public error(message: any, error: Error) {
    this.logger.error(`${message}:`, error);
  }
}
