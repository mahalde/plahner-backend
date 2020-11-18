import { asyncMap, isProdMode, isTestMode } from './utils';

describe('Utils', () => {
  describe('asyncMap', () => {
    it('should map the array with async methods', async () => {
      const givenArr = [1, 2, 3];
      const asyncFn = async (num: number) => Promise.resolve(num * 2);
      const expectedArr = [2, 4, 6];
      const actualArr = await asyncMap(givenArr, asyncFn);

      expect(actualArr).toStrictEqual(expectedArr);
    });
  });

  describe('isProdMode', () => {
    it('should return true if the process is in production mode', () => {
      process.env.NODE_ENV = 'production';

      const result = isProdMode();

      expect(result).toBeTrue();
    });

    it('should return false if the process is not in production mode', () => {
      process.env.NODE_ENV = 'test';

      const result = isProdMode();

      expect(result).toBeFalse();
    });
  });

  describe('isTestMode', () => {
    it('should return true if the process is in test mode', () => {
      process.env.NODE_ENV = 'test';

      const result = isTestMode();

      expect(result).toBeTrue();
    });

    it('should return false if the process is not in test mode', () => {
      process.env.NODE_ENV = 'production';

      const result = isTestMode();

      expect(result).toBeFalse();
    });
  });
});
