import { Test, TestingModule } from '@nestjs/testing';
import { WatchInboxService } from './watch-inbox.service';

describe('WatchInboxService', () => {
  let service: WatchInboxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WatchInboxService],
    }).compile();

    service = module.get<WatchInboxService>(WatchInboxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
