import { Type as t } from '@sinclair/typebox';
import { KycStatus } from '@prisma/client';

export const UpdateStatusInput = {
  body: t.Object({
    user_id: t.Number(),
    kyc_status: t.Enum(KycStatus),
  }),
  response: {
    200: t.Object({
      data: t.Any(),
    }),
    404: t.Object({
      msg: t.String(),
    }),
    500: t.Object({
      msg: t.String(),
    }),
  },
};

export const FetchAllUsersInputs = {
  response: {
    200: t.Object({
      data: t.Any(),
    }),
    404: t.Object({
      msg: t.String(),
    }),
    500: t.Object({
      msg: t.String(),
    }),
  },
};
