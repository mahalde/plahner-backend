import winston from 'winston';
import { FileTransportInstance } from 'winston/lib/winston/transports';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerService;
  let logger: winston.Logger;
  let transportNames: string[];

  beforeEach(async () => {
    service = new LoggerService('TestService');
    logger = (service as any).logger;
    transportNames = (logger.transports as any[]).map((transport: FileTransportInstance) => transport.name);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create the logger', () => {
    expect(logger).toBeDefined();
  });

  it('should have the specified service name', () => {
    expect(logger.defaultMeta.service).toBe('TestService');
  });

  it('should have level `debug` on non prod mode', () => {
    expect(logger.level).toBe('debug');
  });

  it('should have file transports', () => {
    expect(transportNames).toContain('file');
  });

  it('should have a console transport on non prod mode', () => {
    expect(transportNames).toContain('console');
  });

  describe('production mode', () => {

    beforeEach(async () => {
      process.env.NODE_ENV = 'production';

      service = new LoggerService('TestService');
      logger = (service as any).logger;
      transportNames = (logger.transports as any[]).map((transport: FileTransportInstance) => transport.name);
    });

    afterEach(() => process.env.NODE_ENV = 'test');

    it('should have level `info` on production mode', () => {
      expect(logger.level).toBe('info');
    });

    it('should not have a console transport on production mode', () => {
      expect(transportNames).not.toContain('console');
    });
  });

  describe('logging methods', () => {
    const args: [string, string] = ['This is the message', 'This is an argument'];
    const errorArgs: [string, Error] = [
      'This is the Error',
      new Error('Error message'),
    ];

    it('should call the info method with the given arguments', () => {
      const infoSpy = jest.spyOn(logger, 'info');

      service.info(...args);

      expect(infoSpy).toHaveBeenCalledWith(...args);
    });

    it('should call the warn method with the given arguments', () => {
      const warnSpy = jest.spyOn(logger, 'warn');

      service.warn(...errorArgs);

      expect(warnSpy).toHaveBeenCalledWith(...errorArgs);
    });

    it('should call the error method with the given arguments', () => {
      const errorSpy = jest.spyOn(logger, 'error');

      service.error(...errorArgs);

      expect(errorSpy).toHaveBeenCalledWith(...errorArgs);
    });
  });
});
