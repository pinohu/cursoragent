import { NextResponse } from 'next/server';
import { getEnvVar } from '../../../utils/env';
import { createLogger } from '../../../utils/logger';

const logger = createLogger('analytics-events');

export async function POST(request: Request) {
  try {
    const { events } = await request.json();

    // Log events to your preferred analytics service
    events.forEach((event: any) => {
      logger.info('Client event:', {
        name: event.name,
        properties: event.properties,
        timestamp: event.timestamp
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to process event analytics:', error);
    return NextResponse.json(
      { error: 'Failed to process event analytics' },
      { status: 500 }
    );
  }
} 