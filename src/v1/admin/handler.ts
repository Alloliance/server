import { FastifyRequestTypebox, FastifyReplyTypebox } from '@/v1/fastifyTypes';
import { prisma } from '@/config/db';
import { ERRORS } from '@/helpers/errors';
import { KycStatus } from '@/config/db';
import { UpdateStatusInput, FetchAllUsersInputs } from './schema';
import { ERROR500, STANDARD } from '@/helpers/constants';
import { allolianceSdk } from '@/config/sdk';

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
      select: {
        user: true,
      },
    });

    if (!updatedUserKycStatus)
      rep.code(STANDARD.NOCONTENT).send({ msg: ERRORS.userNotExists });
    else {
      const metadata = await allolianceSdk.createKYCMetadata(
        user_id.toString(),
        updatedUserKycStatus.user.allo_profile_id,
        true
      );
      const ipfsHash = await allolianceSdk.uploadMetadataToIpfs(metadata);

      if (ipfsHash) {
        rep
          .code(STANDARD.SUCCESS)
          .send({ data: updatedUserKycStatus, ...ipfsHash });
      } else {
        await prisma.kyc.update({
          where: { user_id: user_id },
          data: {
            kyc_status: KycStatus.SUBMITTED,
          },
        });
        rep.code(STANDARD.NOCONTENT).send({ msg: ERRORS.failedIpfsUpload });
      }
    }
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
        allo_profile_id: true,
        email: true,
        wallet_address: true,
        name: true,
        created_at: true,
        Kyc: true,
      },
    });

    if (!userKycStatus)
      rep.code(STANDARD.NOCONTENT).send({ msg: ERRORS.userNotExists });
    else rep.code(STANDARD.SUCCESS).send({ data: userKycStatus });
  } catch (error) {
    console.error('Error fetching user status: ', error);
    rep.code(ERROR500.statusCode).send({ msg: ERROR500.message });
  }
}
