import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.DEV_USE_PUBLIC_DNS = 'false';
process.env.MONGODB_URI = 'mongodb://localhost/test';
process.env.JWT_ACCESS_SECRET = 'a'.repeat(40);
process.env.JWT_REFRESH_SECRET = 'b'.repeat(40);

const { createApp } = await import('../src/app.js');

describe('health endpoint', () => {
  it('returns service status', async () => {
    const res = await request(createApp()).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('foodsurplus-api');
  });
  it('allows credentialed health requests from the Vite fallback port', async () => {
    const res = await request(createApp())
      .get('/api/v1/health')
      .set('Origin', 'http://localhost:5174');

    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5174');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });
  it('returns 404 JSON for unknown routes', async () => {
    const res = await request(createApp()).get('/api/v1/nope');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
