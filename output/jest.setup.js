// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_APP_NAME = 'Test App';
process.env.NEXT_PUBLIC_APP_DESCRIPTION = 'Test Description';
process.env.NEXT_PUBLIC_API_URL = 'http://test.com';
process.env.CURSOR_PATH = '/path/to/cursor';
process.env.LOG_LEVEL = 'info';
process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE = '1000';
process.env.RATE_LIMIT_REQUESTS = '100';
process.env.RATE_LIMIT_WINDOW_MS = '900000';

// Mock console methods to prevent noise during tests
console.error = jest.fn();
console.warn = jest.fn();
console.log = jest.fn(); 