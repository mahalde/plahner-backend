import * as winston from 'winston';
import { isProdMode, isTestMode } from '../utils';

/** Formatting methods */
const { combine, timestamp, printf, colorize, prettyPrint } = winston.format;

/**
 * Utility service to log information
 */
export class LoggerService {
  /** The internal logger used to log messages and errors */
  private readonly logger: winston.Logger;

  /**
   * Constructs a new instance of the LoggerService
   * @param serviceName the name of the service displayed in the log
   */
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

    /** The format in which to log messages to console */
    const consoleFormat: winston.Logform.Format = printf(o => {
      const hasError = o.level === 'error';
      const name = isTestMode() ? expect.getState().currentTestName : o.service;
      return `${o.level.toUpperCase().padEnd(6)} [${process.pid}] ${
        o.timestamp
      } - [${name}] ${o.message} ${hasError ? '\n' + o.stack : ''}`;
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

  /**
   * Logs a message as info
   * @param message the message to log
   * @param obj an optional informational object
   */
  public info(message: any, obj?: any) {
    this.logger.info(message, obj);
  }

  /**
   * Logs an error which is not critical to production
   * and continuation of the backend
   * @param message the message of the error
   * @param error the occurred error
   */
  public warn(message: any, error?: Error) {
    this.logger.warn(message, error);
  }

  /**
   * Logs an error which is critical to production
   * and can lead to service downtime / misconfiguration
   * @param message the message of the error
   * @param error the occurred error
   */
  public error(message: any, error: Error) {
    this.logger.error(`${message}:`, error);
  }
}
