import { Express } from 'express-serve-static-core';
import request from 'supertest';

import { HttpStatuses, createServer } from '../core/server';

describe('Api Router', () => {
  let server: Express;
  beforeEach(async () => {
    server = await createServer();
  });

  it('should get from API Person Enpoint', () => {
    request(server).get('/api/person').expect('Content-Type', /json/).expect(HttpStatuses.Ok);
  });
});
