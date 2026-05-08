import pino, { LoggerOptions } from 'pino';
import { Params } from 'nestjs-pino';

// base config for plain logger usage
export const pinoConfig: LoggerOptions = {
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: true,
      levelFirst: true,
      ignore: 'pid,hostname,time',
      messageFormat: '{msg}',
    },
  },
};

// nestjs-pino HTTP config
export const pinoHttpConfig: Params = {
  pinoHttp: {
    ...pinoConfig,
    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage(req, res, responseTime) {
      return `${req.method} ${req.url} ${res.statusCode} Completed in: ${responseTime}ms`;
    },
    customErrorMessage(req, _res, err) {
      return `${req.method} ${req.url} Failed: ${err.message}`;
    },
  },
};

export const logger = pino(pinoConfig);
