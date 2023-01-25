import { createDummyServer, DummyServer } from './dummy-server';
import * as usersResponse from './users.json';

export const createDummyUserServiceServer = async (): Promise<DummyServer> => {
  return createDummyServer((app) => {
    app.get('/users', (req, res) => {
      if (req.query.type !== 'user') {
        return res.status(403).send('User type is not valid');
      }

      res.json(usersResponse);
    });
  });
};
