import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  getHello(): string {
    return `Hello from the Plahner Backend in ${this.config.get(
      'NODE_ENV',
    )} mode!`;
  }
}
