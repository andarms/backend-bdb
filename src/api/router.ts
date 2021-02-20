import { Router } from 'express';

import { personRoutes } from './person/person.routes';

function apiRoutes(): Router {
  const router = Router();
  router.use('/person', personRoutes());
  return router;
}

export { apiRoutes };
