import morgan from 'morgan';
import logger from '../config/logger.js';

morgan.token('reqid', (request) => request.id || '-');

export const httpLogger = morgan(
  ':reqid :method :url :status :response-time ms - :res[content-length]',
  {
    stream: {
      write: (message) => logger.info({ type: 'http' }, message.trim()),
    },
  },
);
