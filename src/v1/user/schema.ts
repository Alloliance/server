import { Type as t } from '@sinclair/typebox';
import { DocumentType } from '@prisma/client';

export const SubmitInput = {
  body: t.Object({
    email: t.String(),
    wallet_address: t.String(),
    name: t.Optional(t.String()),
    document_type: t.Enum(DocumentType),
    kyc_data: t.Object({
      front: t.String(),
      back: t.String(),
      selfie: t.String(),
    }),
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

export const StatusInput = {
  body: t.Object({
    wallet_address: t.String(),
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
