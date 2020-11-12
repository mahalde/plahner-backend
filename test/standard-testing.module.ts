import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { when } from 'jest-when';

const mockConfigServiceFactory = () => {
  const mockGet = jest.fn();
  const mockService = {
    get: mockGet,
  };

  when(mockGet)
    .calledWith('NODE_ENV')
    .mockReturnValue('awesome');

  return mockService;
};

@Module({
  providers: [
    {
      provide: ConfigService,
      useFactory: mockConfigServiceFactory,
    },
  ],
  exports: [ConfigService],
})
export class StandardTestingModule {}
