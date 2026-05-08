import pino, { type LoggerOptions } from 'pino';
import { pinoConfig } from './logger.config';

export const logger = pino(pinoConfig as LoggerOptions);
