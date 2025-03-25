import winston from 'winston';
import { getEnvVar, getBooleanEnvVar } from './env';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

winston.addColors(logColors);

const formatters = [
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
];

if (process.env.NODE_ENV !== 'production') {
  formatters.push(
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level}]: ${message} ${
        Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
      }`;
    })
  );
}

export function createLogger(name: string) {
  const transports: winston.transport[] = [new winston.transports.Console()];

  if (getBooleanEnvVar('LOG_TO_FILE')) {
    transports.push(
      new winston.transports.File({
        filename: `logs/${name}-error.log`,
        level: 'error',
      }),
      new winston.transports.File({
        filename: `logs/${name}-combined.log`,
      })
    );
  }

  return winston.createLogger({
    level: getEnvVar('LOG_LEVEL'),
    levels: logLevels,
    format: winston.format.combine(...formatters),
    defaultMeta: { service: name },
    transports,
  });
}

export const logger = createLogger('app'); 