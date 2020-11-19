import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * The general backend service
 *
 * Used for general and basic business logic
 */
@Injectable()
export class AppService {
  /**
   * Constructs the AppService
   * @param config an instance of the ConfigService
   */
  constructor(private readonly config: ConfigService) {}

  /**
   * Returns a welcome string
   */
  getHello(): string {
    return `Hello from the Plahner Backend in ${this.config.get(
      'NODE_ENV',
    )} mode!`;
  }
}
