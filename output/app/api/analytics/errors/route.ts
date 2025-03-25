import { NextResponse } from 'next/server';
import { getEnvVar } from '../../../utils/env';
import { createLogger } from '../../../utils/logger';

const logger = createLogger('analytics-errors');

export async function POST(request: Request) {
  try {
    const { errors } = await request.json();

    // Log errors to your preferred logging service
    errors.forEach((error: any) => {
      logger.error('Client error:', {
        error: error.error,
        componentStack: error.componentStack,
        eventId: error.eventId,
        tags: error.tags
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to process error analytics:', error);
    return NextResponse.json(
      { error: 'Failed to process error analytics' },
      { status: 500 }
    );
  }
} 