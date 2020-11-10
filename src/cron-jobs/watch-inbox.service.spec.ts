import { Test, TestingModule } from '@nestjs/testing';
import { GmailClientService } from 'src/shared/services/gmail-client.service';
import { StandardTestingModule } from 'test/standard-testing.module';
import { WatchInboxService } from './watch-inbox.service';

describe('WatchInboxService', () => {
  let service: WatchInboxService;
  const mockGmailClientService = {
    watchInbox: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StandardTestingModule],
      providers: [
        WatchInboxService,
        {
          provide: GmailClientService,
          useValue: mockGmailClientService,
        }
      ],
    }).compile();

    service = module.get<WatchInboxService>(WatchInboxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('watchGMailInbox', () => {

    afterEach(() => {
      mockGmailClientService.watchInbox.mockClear();
    });

    it('should call the gmail clients watch inbox', async () => {
      await service.watchGMailInbox();

      expect(mockGmailClientService.watchInbox).toHaveBeenCalledTimes(1);
    });

    it('should call the gmail clients watch inbox with an environmental value', async () => {
      await service.watchGMailInbox();

      expect(mockGmailClientService.watchInbox).toBeCalledTimes(1);
      expect(mockGmailClientService.watchInbox).toHaveBeenCalledWith('testProject');
    });
  });
});
