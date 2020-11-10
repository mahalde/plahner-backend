/* eslint-disable @typescript-eslint/no-unused-vars */
const watchMock = jest.fn();
const messageListMock = jest.fn();
const messageGetMock = jest.fn();

const gmailMock = jest.fn(function(oauth2Client, userId) {
  return {
    users: {
      watch: watchMock,
      messages: {
        list: messageListMock,
        get: messageGetMock,
      },
    },
  };
});

const mocks: jest.Mock[] = [
  gmailMock,
  watchMock,
  messageGetMock,
  messageListMock,
];

import { OAuth2Client } from 'google-auth-library';
import { gmail_v1 } from 'googleapis';
import { GmailClientService } from './gmail-client.service';
import { LoggerService } from './logger.service';

jest.mock('googleapis', () => {
  return {
    gmail_v1: {
      Gmail: gmailMock,
    },
  };
});

describe('GmailClientService', () => {
  const expectedUserId = 'testId';
  const expectedError = { message: 'This is an error' };
  let service: GmailClientService;
  let loggerInfoSpy: jest.SpyInstance;
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    const oauthClient = new OAuth2Client();
    service = new GmailClientService(oauthClient, expectedUserId);
    loggerInfoSpy = jest.spyOn(
      (service as any).logger as LoggerService,
      'info',
    );
    loggerErrorSpy = jest.spyOn(
      (service as any).logger as LoggerService,
      'error',
    );

    expect(gmailMock).toHaveBeenCalledWith({ auth: oauthClient });
  });

  afterEach(() => {
    mocks.forEach(mock => mock.mockClear());
    loggerErrorSpy.mockClear();
    loggerInfoSpy.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('watchInbox', () => {
    const expectedTopicName = 'topicName';

    it('should watch the inbox', async () => {
      watchMock.mockResolvedValue(null);
      await service.watchInbox(expectedTopicName);

      expect(watchMock).toHaveBeenCalledWith({
        userId: expectedUserId,
        requestBody: { topicName: expectedTopicName },
      });
      expect(loggerInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining('handled successfully'),
      );
    });

    it('should log the error on watch inbox error', async () => {
      watchMock.mockRejectedValue(expectedError);

      await service.watchInbox(expectedTopicName);

      expect(watchMock).toHaveBeenCalledWith({
        userId: expectedUserId,
        requestBody: { topicName: expectedTopicName },
      });
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error'),
        expectedError,
      );
    });
  });

  describe('getAllInboxMessageIDs', () => {
    const expectedMessages: gmail_v1.Schema$Message[] = [
      { id: 'testId' },
      { id: 'anotherId' },
    ];

    beforeEach(() =>
      messageListMock.mockResolvedValue({
        data: { messages: expectedMessages },
      }),
    );

    it('should return the messages', async () => {
      const numberOfMessages = 10;
      const actualMessages = await service.getAllInboxMessageIDs(
        numberOfMessages,
      );

      expect(messageListMock).toHaveBeenCalledWith({
        userId: expectedUserId,
        maxResults: numberOfMessages,
      });
      expect(actualMessages).toStrictEqual(expectedMessages);
    });

    it('should return a default of 20 messages', async () => {
      await service.getAllInboxMessageIDs();

      expect(messageListMock).toHaveBeenCalledWith({
        userId: expectedUserId,
        maxResults: 20,
      });
    });

    it('should log an error and return undefined on failure', async () => {
      messageListMock.mockRejectedValue(expectedError);

      const actualMessages = await service.getAllInboxMessageIDs();

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error'),
        expectedError,
      );
      expect(actualMessages).toBeUndefined();
    });
  });

  describe('getMail', () => {
    const expectedId = 'testId';
    const expectedMessage: gmail_v1.Schema$Message = {
      id: expectedId,
    };

    beforeEach(() =>
      messageGetMock.mockResolvedValue({ data: expectedMessage }),
    );

    it('should fetch the message', async () => {
      const actualMessage = await service.getMail(expectedId);

      expect(messageGetMock).toHaveBeenCalledWith({
        userId: expectedUserId,
        id: expectedId,
      });
      expect(actualMessage).toStrictEqual(expectedMessage);
    });

    it('should log an error and return undefined on failure', async () => {
      messageGetMock.mockRejectedValue(expectedError);

      const actualMessage = await service.getMail(expectedId);

      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error'),
        expectedError,
      );
      expect(actualMessage).toBeUndefined();
    });
  });
});
