import http, { IncomingMessage, Server, ServerResponse } from 'http';
import * as dotenv from 'dotenv';
import { mapRouter } from './api/routes/router';

dotenv.config()

const PORT: number = Number(process.env.PORT) || 3001;

const server: Server = http.createServer(mapRouter);

server.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});