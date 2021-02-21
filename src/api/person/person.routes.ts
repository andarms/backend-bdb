import { Request, Response, Router } from 'express';

import { HttpStatuses, writeJsonResponse } from '../../core/server';
import { Person, PersonModel } from './person.model';

async function findAllPersons(_: Request, response: Response): Promise<void> {
  const personModel = new PersonModel();
  const persons = await personModel.finadAll();
  writeJsonResponse(response, HttpStatuses.Ok, persons);
}

async function findPerson(request: Request, response: Response): Promise<void> {
  const id = request.params.id;
  const personModel = new PersonModel();
  const person = await personModel.find(id);
  if (!person) {
    return writeJsonResponse(response, HttpStatuses.NotFound, null);
  }
  person.relatives = await personModel.findRelatives(id);
  writeJsonResponse(response, HttpStatuses.Ok, person);
}

async function createPerson(request: Request, response: Response): Promise<void> {
  const person: Person = request.body;
  const personModel = new PersonModel();
  try {
    await personModel.create(person);
  } catch (error) {
    return writeJsonResponse(response, HttpStatuses.BadRequest, error);
  }
  writeJsonResponse(response, HttpStatuses.Ok, null);
}

function personRoutes(): Router {
  const routes = Router();
  routes.get('/:id', findPerson);
  routes.post('/', createPerson);
  routes.get('/', findAllPersons);
  return routes;
}

export { findAllPersons, findPerson, createPerson, personRoutes };
