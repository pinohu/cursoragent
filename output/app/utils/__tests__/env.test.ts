import { validateEnvironment, getEnvVar, getNumericEnvVar, getBooleanEnvVar } from '../env';

describe('Environment Variable Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('validateEnvironment', () => {
    it('should throw error when required variables are missing', () => {
      process.env = {};
      expect(() => validateEnvironment()).toThrow('Missing or invalid environment variables');
    });

    it('should validate LOG_LEVEL correctly', () => {
      process.env = {
        ...process.env,
        NEXT_PUBLIC_APP_NAME: 'Test App',
        NEXT_PUBLIC_APP_DESCRIPTION: 'Test Description',
        NEXT_PUBLIC_API_URL: 'http://test.com',
        CURSOR_PATH: '/path/to/cursor',
        LOG_LEVEL: 'invalid',
        NEXT_PUBLIC_MAX_UPLOAD_SIZE: '1000',
        RATE_LIMIT_REQUESTS: '100',
        RATE_LIMIT_WINDOW_MS: '900000'
      };
      expect(() => validateEnvironment()).toThrow('LOG_LEVEL: Invalid log level specified');
    });

    it('should validate numeric values correctly', () => {
      process.env = {
        ...process.env,
        NEXT_PUBLIC_APP_NAME: 'Test App',
        NEXT_PUBLIC_APP_DESCRIPTION: 'Test Description',
        NEXT_PUBLIC_API_URL: 'http://test.com',
        CURSOR_PATH: '/path/to/cursor',
        LOG_LEVEL: 'info',
        NEXT_PUBLIC_MAX_UPLOAD_SIZE: 'not-a-number',
        RATE_LIMIT_REQUESTS: '100',
        RATE_LIMIT_WINDOW_MS: '900000'
      };
      expect(() => validateEnvironment()).toThrow('NEXT_PUBLIC_MAX_UPLOAD_SIZE: Must be a valid number');
    });

    it('should pass when all variables are valid', () => {
      process.env = {
        ...process.env,
        NEXT_PUBLIC_APP_NAME: 'Test App',
        NEXT_PUBLIC_APP_DESCRIPTION: 'Test Description',
        NEXT_PUBLIC_API_URL: 'http://test.com',
        CURSOR_PATH: '/path/to/cursor',
        LOG_LEVEL: 'info',
        NEXT_PUBLIC_MAX_UPLOAD_SIZE: '1000',
        RATE_LIMIT_REQUESTS: '100',
        RATE_LIMIT_WINDOW_MS: '900000'
      };
      expect(() => validateEnvironment()).not.toThrow();
    });
  });

  describe('getEnvVar', () => {
    it('should return environment variable value', () => {
      process.env.TEST_VAR = 'test-value';
      expect(getEnvVar('TEST_VAR')).toBe('test-value');
    });

    it('should throw when variable is missing', () => {
      expect(() => getEnvVar('NONEXISTENT_VAR')).toThrow('Missing environment variable');
    });
  });

  describe('getNumericEnvVar', () => {
    it('should return numeric value', () => {
      process.env.TEST_NUM = '123';
      expect(getNumericEnvVar('TEST_NUM')).toBe(123);
    });

    it('should throw when value is not numeric', () => {
      process.env.TEST_NUM = 'not-a-number';
      expect(() => getNumericEnvVar('TEST_NUM')).toThrow('must be a number');
    });
  });

  describe('getBooleanEnvVar', () => {
    it('should return true for "true"', () => {
      process.env.TEST_BOOL = 'true';
      expect(getBooleanEnvVar('TEST_BOOL')).toBe(true);
    });

    it('should return false for "false"', () => {
      process.env.TEST_BOOL = 'false';
      expect(getBooleanEnvVar('TEST_BOOL')).toBe(false);
    });

    it('should return false for any other value', () => {
      process.env.TEST_BOOL = 'anything';
      expect(getBooleanEnvVar('TEST_BOOL')).toBe(false);
    });
  });
}); 