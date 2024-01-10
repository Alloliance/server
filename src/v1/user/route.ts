import { FastifyInstance } from 'fastify';
import { methods } from '@/helpers/api';
import { submitKycToDb, checkVerificationStatus } from './handler';
import { SubmitInput, StatusInput } from './schema';

const User = async (app: FastifyInstance) => {
  /** @description submit frontend kyc info plus */
  app.route({
    method: methods.POST,
    url: '/submit',
    schema: SubmitInput,
    handler: await submitKycToDb,
  });

  /** @description check user kyc status */
  app.route({
    method: methods.POST,
    url: '/status',
    schema: StatusInput,
    handler: await checkVerificationStatus,
  });
};

export default User;
