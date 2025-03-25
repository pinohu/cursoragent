import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as winston from 'winston';

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
  try {
    // Validate environment
    const envError = validateEnvironment();
    if (envError) {
      logger.error('Environment validation failed:', envError);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Rate limiting check
    const ip = request.ip || 'unknown';
    const now = Date.now();
    const userRequests = rateLimit.current.get(ip) || 0;
    
    if (userRequests >= rateLimit.maxRequests) {
      logger.warn('Rate limit exceeded for IP:', ip);
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    rateLimit.current.set(ip, userRequests + 1);
    setTimeout(() => rateLimit.current.delete(ip), rateLimit.windowMs);

    const data = await request.json() as IdeaData;
    
    // Validate request size
    const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE || '10485760');
    if (JSON.stringify(data).length > maxSize) {
      logger.warn('Request payload too large:', { size: JSON.stringify(data).length, maxSize });
      return NextResponse.json(
        { error: 'Request payload too large' },
        { status: 413 }
      );
    }

    // Validate required fields
    const requiredFields = ['name', 'description', 'applicationType', 'features', 'technologies', 'dependencies'] as const;
    for (const field of requiredFields) {
      if (!data[field]) {
        logger.warn('Missing required field:', field);
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    logger.info('Processing idea request', { 
      name: data.name, 
      applicationType: data.applicationType 
    });

    // Process the idea
    const result = {
      status: 'success',
      message: 'Idea processed successfully',
      data: {
        ...data,
        processedAt: new Date().toISOString(),
        betaFeatures: process.env.NEXT_PUBLIC_ENABLE_BETA_FEATURES === 'true'
      }
    };

    logger.info('Idea processed successfully', { 
      name: data.name, 
      processedAt: result.data.processedAt 
    });

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    logger.error('Error processing idea:', { error: errorMessage });
    return NextResponse.json(
      { error: 'Failed to process idea' },
      { status: 500 }
    );
  }
} 