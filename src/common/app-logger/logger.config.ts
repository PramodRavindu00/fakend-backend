import { Params } from 'nestjs-pino';

export const pinoConfig: Params['pinoHttp'] = {
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: true,
      levelFirst: true,
      ignore: 'pid,hostname,req,res,responseTime,err',
      messageFormat: '{msg}',
    },
  },
  customLogLevel(_req, res, err) {
    if (err || res.statusCode >= 500) {
      return 'error';
    }
    if (res.statusCode >= 400) {
      return 'warn';
    }
    return 'info';
  },
  customSuccessMessage(req, res, responseTime) {
    return `${req.method} ${req.url} ${res.statusCode} (${responseTime}ms)`;
  },
  customErrorMessage(req, res, err) {
    if (err) {
      return `${req.method} ${req.url} ${res.statusCode} ERROR: ${err.message}`;
    }
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
};
