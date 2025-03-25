import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This API endpoint is not available in static export mode. Please use the production API endpoint instead.' 
    },
    { status: 501 }
  );
} 