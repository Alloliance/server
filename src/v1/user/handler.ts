import { FastifyRequestTypebox, FastifyReplyTypebox } from '@/v1/fastifyTypes';
import { prisma } from '@/db/index';
import { ERRORS } from '@/helpers/errors';
import { SubmitInput } from './schema';
import { ERROR404, ERROR500, STANDARD } from '@/helpers/constants';
import { KycType } from '@prisma/client';

export async function submitKycToDb(
  req: FastifyRequestTypebox<typeof SubmitInput>,
  rep: FastifyReplyTypebox<typeof SubmitInput>
): Promise<void> {
  const { email, wallet_address, name, document_type, kyc_data } = req.body;

  try {
    const kycSubmitted = await prisma.user.create({
		data: {
			name: name,
			email: email,
			wallet_address: wallet_address,
			Kyc: {
				create: {
					kyc_type: KycType.SUBMITTED,
					document_type: document_type,
					kyc_data: kyc_data,
				}
			}
		  },
    });

    if (!kycSubmitted)
      rep.code(ERROR404.statusCode).send({ msg: ERRORS.createKycError });
    else rep.code(STANDARD.SUCCESS).send({ data: kycSubmitted });
  } catch (error) {
    console.error('Error checking user auth: ', error);
    rep.code(ERROR500.statusCode).send({ msg: ERROR500.message });
  }
}
