export function validateEnvironment(): void {
  const requiredEnvVars = {
    // Application Settings
    NEXT_PUBLIC_APP_NAME: 'Application name is required',
    NEXT_PUBLIC_APP_DESCRIPTION: 'Application description is required',
    NEXT_PUBLIC_API_URL: 'API URL is required',

    // Cursor Configuration
    CURSOR_PATH: 'Cursor executable path is required',

    // Logging
    LOG_LEVEL: 'Log level must be one of: error, warn, info, debug',

    // Security
    NEXT_PUBLIC_MAX_UPLOAD_SIZE: 'Maximum upload size is required',

    // Rate Limiting
    RATE_LIMIT_REQUESTS: 'Rate limit request count is required',
    RATE_LIMIT_WINDOW_MS: 'Rate limit window duration is required',
  } as const;

  const missingVars: string[] = [];

  // Check for missing variables
  Object.entries(requiredEnvVars).forEach(([key, message]) => {
    if (!process.env[key]) {
      missingVars.push(`${key}: ${message}`);
    }
  });

  // Validate LOG_LEVEL values
  if (
    process.env.LOG_LEVEL &&
    !['error', 'warn', 'info', 'debug'].includes(process.env.LOG_LEVEL)
  ) {
    missingVars.push('LOG_LEVEL: Invalid log level specified');
  }

  // Validate numeric values
  const numericVars = [
    'NEXT_PUBLIC_MAX_UPLOAD_SIZE',
    'RATE_LIMIT_REQUESTS',
    'RATE_LIMIT_WINDOW_MS',
  ];

  numericVars.forEach((key) => {
    const value = process.env[key];
    if (value && isNaN(Number(value))) {
      missingVars.push(`${key}: Must be a valid number`);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      'Missing or invalid environment variables:\n' + missingVars.join('\n')
    );
  }
}

export function getEnvVar(key: keyof NodeJS.ProcessEnv): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export function getNumericEnvVar(key: keyof NodeJS.ProcessEnv): number {
  const value = getEnvVar(key);
  const numValue = Number(value);
  if (isNaN(numValue)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return numValue;
}

export function getBooleanEnvVar(key: keyof NodeJS.ProcessEnv): boolean {
  return getEnvVar(key).toLowerCase() === 'true';
} 