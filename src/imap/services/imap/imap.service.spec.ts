import { EventEmitter } from 'events';
import { Config } from 'imap';
import { ImapSimple, ImapSimpleOptions } from 'imap-simple';
import { ImapService } from './imap.service';

const openBoxMock = jest.fn();
const emitter = new EventEmitter();

jest.mock('imap-simple', () => ({
  connect: (config: ImapSimpleOptions) => {
    const imap = {
      openBox: openBoxMock,
      on: emitter.on,
      emit: emitter.emit,
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    imap.on('mail', config.onmail ?? (() => {}));

    return imap;
  },
}));

describe('ImapService', () => {
  let service: ImapService;
  let imapClient: ImapSimple;

  const expectedConfig: Config = {
    user: 'testuser',
    password: 'password123',
    host: 'testhost',
    port: 123,
    tls: false,
  };
  const expectedMaxRetries = 5;
  const expectedRetryTimeout = 2000;

  beforeEach(() => {
    service = new ImapService(
      expectedConfig,
      expectedMaxRetries,
      expectedRetryTimeout,
    );
  });

  afterEach(() => {
    openBoxMock.mockReset();
    emitter.removeAllListeners();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call the mailbox connection on init', async () => {
    const connectionSpy = jest
      .spyOn(service, 'connectToMailbox')
      .mockResolvedValue();

    await service.onModuleInit();

    expect(connectionSpy).toHaveBeenCalled();
  });

  it('should open the inbox folder of the mailbox', async () => {
    await service.connectToMailbox();

    expect(openBoxMock).toHaveBeenCalledWith('INBOX');
  });

  it('should call the onNewMail function on new mail', async () => {
    const newMailSpy = jest.spyOn(service, 'onNewMail');
    await service.connectToMailbox();
    imapClient = (service as any).imapClient;

    imapClient.emit('mail', 1);

    expect(newMailSpy).toHaveBeenCalledWith(1);
  });

  it('should call the onError function on error', async () => {
    const onErrorSpy = jest.spyOn(service, 'onError').mockReturnValue();
    const expectedError = new Error('This is the error');

    await service.connectToMailbox();
    imapClient = (service as any).imapClient;

    imapClient.emit('error', expectedError);

    expect(onErrorSpy).toHaveBeenCalledWith(expectedError);
  });

  it('should try to reconnect on connection failure', async () => {
    const reconnectionSpy = jest
      .spyOn(service, 'tryToReconnect')
      .mockReturnValue();

    openBoxMock.mockRejectedValue(null);
    await service.connectToMailbox();

    expect(reconnectionSpy).toHaveBeenCalledTimes(1);
  });

  it('should try to reconnect on general errors', async () => {
    const reconnectionSpy = jest
      .spyOn(service, 'tryToReconnect')
      .mockReturnValue();

    await service.connectToMailbox();
    imapClient = (service as any).imapClient;

    imapClient.emit('error', null);

    expect(reconnectionSpy).toHaveBeenCalledTimes(1);
  });

  describe('reconnection tests', () => {
    beforeEach(() => {
      jest.useFakeTimers();

      jest
        .spyOn(service, 'connectToMailbox')
        .mockImplementation(async () => service.tryToReconnect());
    });

    it('should try to reconnect after the specified amount of time', () => {
      service.tryToReconnect();

      expect(setTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        expectedRetryTimeout,
      );
    });

    it('should try to reconnect the specified times', () => {
      service.tryToReconnect();

      jest.runAllTimers();

      expect(setTimeout).toHaveBeenCalledTimes(expectedMaxRetries);
    });
  });
});
