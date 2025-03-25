import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { analytics } from '../../utils/analytics';

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json();
    
    analytics.trackEvent('api_request_received', { idea });

    // Call AWS Lambda function
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idea }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    analytics.trackEvent('api_request_success', { idea });

    return NextResponse.json(data);
  } catch (error) {
    analytics.trackEvent('api_request_error', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 