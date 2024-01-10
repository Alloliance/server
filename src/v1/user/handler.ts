import { FastifyRequestTypebox, FastifyReplyTypebox } from '@/v1/fastifyTypes';
import { KycType } from '@prisma/client';
import { prisma } from '@/db/index';
import { ERRORS } from '@/helpers/errors';
import { SubmitInput, StatusInput } from './schema';
import { ERROR404, ERROR500, STANDARD } from '@/helpers/constants';

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
          },
        },
      },
    });

    if (!kycSubmitted)
      rep.code(ERROR404.statusCode).send({ msg: ERRORS.createKycError });
    else rep.code(STANDARD.SUCCESS).send({ data: kycSubmitted });
  } catch (error) {
    console.error('Error checking submitting kyc: ', error);
    rep.code(ERROR500.statusCode).send({ msg: ERROR500.message });
  }
}

export async function checkVerificationStatus(
  req: FastifyRequestTypebox<typeof StatusInput>,
  rep: FastifyReplyTypebox<typeof StatusInput>
): Promise<void> {
  const { wallet_address } = req.body;

  try {
    const userKycStatus = await prisma.user.findUnique({
      where: { wallet_address: wallet_address },
      select: {
        user_id: false,
        email: false,
        wallet_address: false,
        name: false,
        created_at: false,
        Kyc: {
          select: {
            kyc_type: true,
          },
        },
      },
    });

    if (!userKycStatus)
      rep.code(ERROR404.statusCode).send({ msg: ERRORS.userNotExists });
    else rep.code(STANDARD.SUCCESS).send({ data: userKycStatus });
  } catch (error) {
    console.error('Error fetching user status: ', error);
    rep.code(ERROR500.statusCode).send({ msg: ERROR500.message });
  }
}
