import { Test, TestingModule } from '@nestjs/testing';
import { InboxListenerService } from './inbox-listener.service';

describe('InboxListenerService', () => {
  let service: InboxListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InboxListenerService],
    }).compile();

    service = module.get<InboxListenerService>(InboxListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
