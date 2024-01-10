import { FastifyRequestTypebox, FastifyReplyTypebox } from '@/v1/fastifyTypes';
import { KycStatus, DocumentType } from '@prisma/client';
import { prisma } from '@/config/db';
import { ERRORS } from '@/helpers/errors';
import { SubmitInput, StatusInput } from './schema';
import { ERROR500, STANDARD } from '@/helpers/constants';

export async function submitKycToDb(
  req: FastifyRequestTypebox<typeof SubmitInput>,
  rep: FastifyReplyTypebox<typeof SubmitInput>
): Promise<void> {
  const { documents, endUserInfo } = req.body as any;
  console.log(
    req.body,
    'onrender body',
    documents[1].type,
    'type doc',
    typeof documents[1].type,
    'BEEEEST'
  );

  try {
    const kycSubmitted = await prisma.user.create({
      data: {
        name: 'Jeff', // default unless we pass in frontend
        email: endUserInfo.email,
        wallet_address: endUserInfo.id,
        allo_profile_id: endUserInfo.phone,
        Kyc: {
          create: {
            kyc_status: KycStatus.SUBMITTED,
            document_type: DocumentType.ID_CARD,
            kyc_data: { ...documents[0].pages, ...documents[1].pages },
          },
        },
      },
    });

    if (!kycSubmitted)
      rep.code(STANDARD.NOCONTENT).send({ msg: ERRORS.createKycError });
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
            kyc_status: true,
          },
        },
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
