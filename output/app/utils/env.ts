export function validateEnvironment(): void {
  const requiredVars = [
    'NEXT_PUBLIC_APP_NAME',
    'NEXT_PUBLIC_APP_DESCRIPTION',
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_ENABLE_ANALYTICS'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate API URL format
  try {
    new URL(process.env.NEXT_PUBLIC_API_URL!);
  } catch (error) {
    throw new Error('Invalid NEXT_PUBLIC_API_URL format');
  }
}

export function getEnvironment(): string {
  return process.env.NODE_ENV || 'development';
}

export function isProduction(): boolean {
  return getEnvironment() === 'production';
}

export function isDevelopment(): boolean {
  return getEnvironment() === 'development';
}

export function isTest(): boolean {
  return getEnvironment() === 'test';
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