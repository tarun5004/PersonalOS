import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';

let server;

async function startServer() {
  try {
    await connectDatabase();
    const app = createApp();

    server = app.listen(env.PORT, () => {
      console.log(`Personal OS API listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start Personal OS API.');
    console.error(error.message);
    process.exit(1);
  }
}

function shutdown(signal) {
  console.log(`${signal} received. Closing Personal OS API.`);

  if (!server) {
    process.exit(0);
  }

  server.close(async () => {
    await disconnectDatabase();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
