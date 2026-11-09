import { createCorsOptions } from '../src/config/cors.js';

function isAllowedOrigin(options, origin) {
  return new Promise((resolve, reject) => {
    options.origin(origin, (error, allowed) => {
      if (error) reject(error);
      else resolve(allowed);
    });
  });
}

describe('CORS origin policy', () => {
  it('allows local Vite origins across development ports', async () => {
    const options = createCorsOptions({ NODE_ENV: 'development', CLIENT_URL: 'http://localhost:5173' });

    await expect(isAllowedOrigin(options, 'http://localhost:5173')).resolves.toBe(true);
    await expect(isAllowedOrigin(options, 'http://localhost:5174')).resolves.toBe(true);
    await expect(isAllowedOrigin(options, 'http://127.0.0.1:5190')).resolves.toBe(true);
    expect(options.credentials).toBe(true);
  });

  it('allows only the configured origin in production', async () => {
    const options = createCorsOptions({ NODE_ENV: 'production', CLIENT_URL: 'https://app.example.com' });

    await expect(isAllowedOrigin(options, 'https://app.example.com')).resolves.toBe(true);
    await expect(isAllowedOrigin(options, 'http://localhost:5173')).resolves.toBe(false);
    await expect(isAllowedOrigin(options, 'https://other.example.com')).resolves.toBe(false);
  });
});
