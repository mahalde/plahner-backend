import { Test, TestingModule } from '@nestjs/testing';
import { GmailClientService } from './gmail-client.service';

describe('GmailClientService', () => {
  let service: GmailClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GmailClientService],
    }).compile();

    service = module.get<GmailClientService>(GmailClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
