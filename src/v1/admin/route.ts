import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/api';
import { updateVerificationStatus, fetchAllUsers } from './handler';
import { UpdateStatusInput, FetchAllUsersInputs } from './schema';

const Admin = async (app: FastifyInstance) => {
  /** @description update a user kyc status */
  app.route({
    method: methods.PUT,
    url: '/status',
    schema: UpdateStatusInput,
    handler: await updateVerificationStatus,
  });

  /** @description get all users */
  app.route({
    method: methods.GET,
    url: '/users',
    schema: FetchAllUsersInputs,
    handler: await fetchAllUsers,
  });
};

export default Admin;
