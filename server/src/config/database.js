import mongoose from 'mongoose';
import { env } from './env.js';

const DEFAULT_CONNECT_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MS = 2000;

function wait(delayMs) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

export async function connectDatabase({
  attempts = DEFAULT_CONNECT_ATTEMPTS,
  retryDelayMs = DEFAULT_RETRY_DELAY_MS,
} = {}) {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await mongoose.connect(env.MONGODB_URI);
      return mongoose.connection;
    } catch (error) {
      if (attempt === attempts) {
        throw error;
      }

      await wait(retryDelayMs);
    }
  }

  return mongoose.connection;
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
}
