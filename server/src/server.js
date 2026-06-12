import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import logger from './config/logger.js';

let server;

async function startServer() {
  try {
    await connectDatabase();
    const app = createApp();

    server = app.listen(env.PORT, () => {
      logger.info({ port: env.PORT }, 'Server listening');
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start Personal OS API');
    process.exit(1);
  }
}

function shutdown(signal) {
  logger.info({ signal }, 'Shutdown requested');

  if (!server) {
    process.exit(0);
  }

  server.close(async () => {
    await disconnectDatabase();
    logger.info({ signal }, 'Server stopped');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
