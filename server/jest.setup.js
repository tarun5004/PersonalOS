process.env.NODE_ENV = 'test';
process.env.PORT = '5050';
process.env.MONGODB_URI = 'mongodb://localhost:27017/personal-os-test';
process.env.JWT_SECRET = 'test-secret-that-is-long-enough-for-jwt';
process.env.JWT_EXPIRES_IN = '7d';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.BCRYPT_SALT_ROUNDS = '4';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '100';
process.env.COOKIE_NAME = 'personal_os_token';
process.env.COOKIE_MAX_AGE_MS = '604800000';
process.env.COOKIE_SECURE = 'false';
process.env.COOKIE_SAME_SITE = 'lax';

