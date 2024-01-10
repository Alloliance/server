import { FastifyRequestTypebox, FastifyReplyTypebox } from '@/v1/fastifyTypes';
import { prisma } from '@/db/index';
import { ERRORS } from '@/helpers/errors';
import { UpdateStatusInput, FetchAllUsersInputs } from './schema';
import { ERROR404, ERROR500, STANDARD } from '@/helpers/constants';

export async function updateVerificationStatus(
  req: FastifyRequestTypebox<typeof UpdateStatusInput>,
  rep: FastifyReplyTypebox<typeof UpdateStatusInput>
): Promise<void> {
  const { user_id, kyc_status } = req.body;

  try {
    const updatedUserKycStatus = await prisma.kyc.update({
      where: { user_id: user_id },
      data: {
        kyc_status: kyc_status,
      },
    });

    if (!updatedUserKycStatus)
      rep.code(ERROR404.statusCode).send({ msg: ERRORS.userNotExists });
    else rep.code(STANDARD.SUCCESS).send({ data: updatedUserKycStatus });
  } catch (error) {
    console.error('Error fetching user status: ', error);
    rep.code(ERROR500.statusCode).send({ msg: ERROR500.message });
  }
}

export async function fetchAllUsers(
  req: FastifyRequestTypebox<typeof FetchAllUsersInputs>,
  rep: FastifyReplyTypebox<typeof FetchAllUsersInputs>
): Promise<void> {
  try {
    const userKycStatus = await prisma.user.findMany({
      select: {
        user_id: true,
        email: true,
        wallet_address: true,
        name: true,
        created_at: true,
        Kyc: true,
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
