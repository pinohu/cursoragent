import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { IdeaInput, Configuration, LogLevel } from '../../../../src/core/types';
import { Orchestrator } from '../../../../src/core/orchestrator';
import * as winston from 'winston';

// Create logger
const logger = winston.createLogger({
  level: 'info',
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
    })
  ]
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idea: IdeaInput = body.idea;

    if (!idea) {
      return NextResponse.json({ error: 'Idea input is required' }, { status: 400 });
    }

    const config: Configuration = {
      cursorPath: process.env.CURSOR_PATH || '',
      workingDirectory: './output',
      deploymentSettings: {
        targets: [],
        credentials: {},
        options: {}
      },
      logLevel: LogLevel.INFO,
      serviceMode: false
    };

    const orchestrator = new Orchestrator(config, logger);
    const result = await orchestrator.processIdea(idea);

    return NextResponse.json(result);
  } catch (error) {
    logger.error(`Error processing idea: ${error}`);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 