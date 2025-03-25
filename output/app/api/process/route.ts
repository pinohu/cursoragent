import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as winston from 'winston';
import { analytics } from '../../utils/analytics';

// Define types
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface IdeaData {
  name: string;
  title?: string;
  description: string;
  applicationType: string;
  features: string;
  technologies: string;
  dependencies: string;
}

// Create logger
const logLevel = (process.env.LOG_LEVEL || 'info') as LogLevel;
const enableFileLogging = process.env.ENABLE_FILE_LOGGING === 'true';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    ...(enableFileLogging ? [
      new winston.transports.File({ 
        filename: 'error.log', 
        level: 'error' 
      }),
      new winston.transports.File({ 
        filename: 'combined.log' 
      })
    ] : [])
  ]
});

// Rate limiting setup
const rateLimit = {
  maxRequests: parseInt(process.env.RATE_LIMIT_REQUESTS || '100'),
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  current: new Map<string, number>()
};

// Validate environment variables
function validateEnvironment(): string | null {
  const requiredEnvVars = [
    'CURSOR_PATH',
    'LOG_LEVEL',
    'NEXT_PUBLIC_MAX_UPLOAD_SIZE',
    'RATE_LIMIT_REQUESTS',
    'RATE_LIMIT_WINDOW_MS'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      return `Missing required environment variable: ${envVar}`;
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This API endpoint is not available in static export mode. Please use the production API endpoint instead.' 
    },
    { status: 501 }
  );
} 