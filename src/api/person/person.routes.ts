import { Request, Response, Router } from 'express';

import { HttpStatuses, writeJsonResponse } from '../../core/server';

async function findAllPersons(_: Request, res: Response): Promise<void> {
  writeJsonResponse(res, HttpStatuses.Ok, []);
}

function personRoutes(): Router {
  const routes = Router();

  routes.get('/', findAllPersons);
  return routes;
}

export { findAllPersons, personRoutes };
