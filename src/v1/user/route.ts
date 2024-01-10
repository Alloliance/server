import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/api';
import { submitKycToDb } from './handler';
import { SubmitInput } from './schema';

const User = async (app: FastifyInstance) => {
  /** @description submit frontend kyc info plus */
  app.route({
    method: methods.POST,
    url: '/submit',
    schema: SubmitInput,
    handler: await submitKycToDb,
  });
};

export default User;
