import { ethers } from 'ethers';
import lighthouse from '@lighthouse-web3/sdk';

const ethereumPk = process.env.ETHEREUM_PRIVATE_KEY as ethers.utils.BytesLike;
const lighthouseApiKey = process.env.LIGHTHOUSE_API_KEY || '';

export const allolianceSdk = {
  createKYCMetadata: async function (
    issuerId: string,
    targetProfileId: string,
    kycOk: boolean
  ) {
    const metadataBody = {
      target_profile_id: targetProfileId,
      kyc_ok: kycOk,
    };

    const signature = await this.signMetadataBody(JSON.stringify(metadataBody));
    const metadata = {
      [issuerId]: {
        body: metadataBody,
      },
      signature: signature,
    };

    const metadataJson = JSON.stringify(metadata);
    return metadataJson;
  },

  signMetadataBody: async function (metadataBody: string) {
    const wallet = new ethers.Wallet(ethereumPk);
    const signature = await wallet.signMessage(metadataBody);
    return signature;
  },

  uploadMetadataToIpfs: async function (metadata: string) {
    // Assuming lighthouse is another module or library you've imported
    // Make sure lighthouse has an uploadText method that matches your usage
    const response = await lighthouse.uploadText(metadata, lighthouseApiKey);
    console.log(response);
    return response.data.Hash;
  },
};
