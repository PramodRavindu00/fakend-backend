import pino, { LoggerOptions } from 'pino';
import { Params } from 'nestjs-pino';

// base config for plain logger usage
export const pinoConfig: LoggerOptions = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: true,
      levelFirst: true,
      ignore: 'pid,hostname,time,req,res,responseTime',
      messageFormat: '{msg}',
    },
  },
};

// nestjs-pino HTTP config
export const pinoHttpConfig: Params = {
  pinoHttp: {
    ...pinoConfig,
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie'],
      remove: true,
    },
    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 400 || err) return 'error';
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
