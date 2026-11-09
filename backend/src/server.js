import http from 'http';
import { Server } from 'socket.io';
import { env } from './config/env.js';
import { createCorsOptions } from './config/cors.js';
import { configureDevelopmentDns } from './config/dns.js';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';

if (configureDevelopmentDns(env)) {
  console.warn(
    'Temporary public DNS override enabled for development; disable DEV_USE_PUBLIC_DNS after system DNS is fixed.',
  );
}

const app = createApp();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: createCorsOptions(env),
});

await connectDB();

server.listen(env.PORT, () => console.log(`API running on http://localhost:${env.PORT}`));
