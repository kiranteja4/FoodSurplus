import http from 'http';
import { Server } from 'socket.io';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';

const app = createApp();
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: env.CLIENT_URL, credentials: true } });

await connectDB();
server.listen(env.PORT, () => console.log(`API running on http://localhost:${env.PORT}`));
