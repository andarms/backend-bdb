import { Request, Response } from 'express';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';

import { findAllPersons } from './person.routes';

describe('Person routes handlers', () => {
  let request: MockRequest<Request<any>>;
  let response: MockResponse<Response<any>>;

  beforeEach(() => {
    response = httpMocks.createResponse();
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/',
    });
  });

  it('should return a list of persons', async () => {
    findAllPersons(request, response);
    expect(response._getJSONData()).toEqual([]);
  });
});
