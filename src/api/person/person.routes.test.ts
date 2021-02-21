import { Request, Response } from 'express';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';

import { HttpStatuses } from '../../core/server';
import { Genders, Person, PersonModel } from './person.model';
import { createPerson, findAllPersons, findPerson } from './person.routes';

const testData: Person[] = [
  {
    id: 1,
    identification: '001',
    fullname: 'test user  1',
    birth: new Date(2021, 1, 20),
    gender: Genders.Male,
  },
];
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
    const modelSpy = spyOn(PersonModel.prototype, 'finadAll').and.returnValue([...testData]);
    await findAllPersons(request, response);
    expect(modelSpy).toHaveBeenCalled();
    expect(response._getJSONData()).toEqual(JSON.parse(JSON.stringify(testData)));
  });

  it('should return single person', async () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      params: { id: 1 },
    });
    const modelSpy = spyOn(PersonModel.prototype, 'find').and.returnValue(testData[0]);
    await findPerson(request, response);
    expect(modelSpy).toHaveBeenCalled();
    expect(response._getJSONData()).toEqual(JSON.parse(JSON.stringify(testData[0])));
  });

  it('should return 404 error', async () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      params: { id: 2 },
    });
    const modelSpy = spyOn(PersonModel.prototype, 'find').and.returnValue(null);
    await findPerson(request, response);
    expect(modelSpy).toHaveBeenCalled();
    expect(response.statusCode).toBe(HttpStatuses.NotFound);
    expect(response._getJSONData()).toBe(null);
  });

  it('should call to create model creation', async () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      body: testData[0],
    });
    const modelSpy = spyOn(PersonModel.prototype, 'create').and.returnValue(0);
    await createPerson(request, response);
    expect(modelSpy).toHaveBeenCalled();
  });

  it('should return bad request for invalid data', async () => {
    request = httpMocks.createRequest({
      method: 'GET',
      url: '/',
      body: {},
    });
    const modelSpy = spyOn(PersonModel.prototype, 'create').and.throwError('Test Error');
    await createPerson(request, response);
    expect(modelSpy).toHaveBeenCalled();
    expect(response.statusCode).toBe(HttpStatuses.BadRequest);
  });
});
