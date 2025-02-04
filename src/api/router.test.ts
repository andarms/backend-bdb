import { Express } from 'express-serve-static-core';
import request from 'supertest';

import { HttpStatuses, createServer } from '../core/server';

describe('Api Router', () => {
  let server: Express;
  beforeEach(async () => {
    server = await createServer();
  });

  it('should get from API Person End Point', () => {
    request(server).get('/api/person').expect('Content-Type', /json/).expect(HttpStatuses.Ok);
  });

  it('should get deatils from API Person End Point', () => {
    request(server).get('/api/person/1').expect('Content-Type', /json/).expect(HttpStatuses.Ok);
  });

  it('should post from API Person End Point', () => {
    request(server).post('/api/person').expect('Content-Type', /json/).expect(HttpStatuses.Ok);
  });

  it('should return 404 for invalid endpoint', () => {
    request(server).get('/api/invalid/endpoint').expect('Content-Type', /json/).expect(HttpStatuses.NotFound);
  });
});
