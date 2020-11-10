import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter } from 'events';
import { StandardTestingModule } from 'test/standard-testing.module';
import { InboxListenerService } from './inbox-listener.service';

const emitter = new EventEmitter();

jest.mock('@google-cloud/pubsub', () => {
  return {
    PubSub: function () {
      return {
        subscription: jest.fn(() => emitter)
      }
    }
  }
});

describe('InboxListenerService', () => {
  let service: InboxListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StandardTestingModule],
      providers: [InboxListenerService],
    }).compile();

    service = module.get<InboxListenerService>(InboxListenerService);
  });

  afterEach(() => emitter.removeAllListeners());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call the listen to inbox function', () => {
      const fnSpy = jest.spyOn(service, 'listenToInbox');

      service.onModuleInit();

      expect(fnSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('listenToInbox', () => {
    it('should acknowledge the message on new message', () => {
      const message = {
        id: 'messageId',
        data: 'messageData',
        attributes: 'messageAttributes',
        ack: () => ({}),
      }
      const spy = jest.spyOn(message, 'ack');

      service.listenToInbox();

      emitter.emit('message', message);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

});
