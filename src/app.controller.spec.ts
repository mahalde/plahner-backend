import { Test, TestingModule } from '@nestjs/testing';
import { VERSION_TOKEN } from './app.constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let app: TestingModule;
  const expectedVersion = '0.3.0';


  beforeEach(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: () => 'Hello from the Plahner Backend in test mode!',
          }
        },
        {
          provide: VERSION_TOKEN,
          useFactory: () => expectedVersion,
        }
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return a welcome message', () => {
      const expectedMessage = 'Hello from the Plahner Backend in test mode!';
      expect(appController.getHello()).toBe(expectedMessage);
    });

    it('should return the expected version', () => {
      expect(appController.getVersion()).toBe(expectedVersion);
    });

    it('should inject the version via dependency injection', () => {
      expect(app.get(VERSION_TOKEN)).not.toBeNull();
    });
  });
});
