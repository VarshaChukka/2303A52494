export type LogStack = 'backend' | 'frontend';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export const ALLOWED_LOG_PACKAGES = [
  'api',
  'backend',
  'component',
  'config',
  'controller',
  'frontend',
  'hook',
  'logger',
  'middleware',
  'page',
  'route',
  'service',
  'state',
  'util',
] as const;

export type LogPackage = (typeof ALLOWED_LOG_PACKAGES)[number];

export interface LogEntry {
  stack: LogStack;
  level: LogLevel;
  package: LogPackage;
  message: string;
}

export interface LoggerOptions {
  authToken?: string;
  endpoint?: string;
}
