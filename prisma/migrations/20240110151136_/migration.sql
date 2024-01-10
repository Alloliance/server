/*
  Warnings:

  - You are about to drop the column `kyc_type` on the `Kyc` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('SUBMITTED', 'SUCCESSFUL', 'UNSUCCESSFUL');

-- AlterTable
ALTER TABLE "Kyc" DROP COLUMN "kyc_type",
ADD COLUMN     "kyc_status" "KycStatus" NOT NULL DEFAULT 'SUBMITTED';

-- DropEnum
DROP TYPE "KycType";
