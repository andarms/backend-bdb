import { OutgoingHttpHeaders } from 'http2';

import express from 'express';
import { Express } from 'express-serve-static-core';

import { apiRoutes } from '../api/router';

async function createServer(): Promise<Express> {
  const server = express();
  server.use(express.json());
  server.use('/api', apiRoutes());

  return server;
}

function writeJsonResponse(
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  code: any,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  payload: any,
  headers?: OutgoingHttpHeaders | undefined,
): void {
  const data = typeof payload === 'object' ? JSON.stringify(payload, null, 2) : payload;
  res.writeHead(code, { ...headers, 'Content-Type': 'application/json' });
  res.end(data);
}

enum HttpStatuses {
  Ok = 200,
  BadRequest = 400,
  InternalServerError = 500,
}

export { createServer, writeJsonResponse, HttpStatuses };
