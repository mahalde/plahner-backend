import { Test, TestingModule } from '@nestjs/testing';
import { StandardTestingModule } from 'test/standard-testing.module';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StandardTestingModule],
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a welcome string', () => {
    const expectedStr = 'Hello from the Plahner Backend in awesome mode!';

    const actualStr = service.getHello();

    expect(actualStr).toBe(expectedStr);
  });
});
