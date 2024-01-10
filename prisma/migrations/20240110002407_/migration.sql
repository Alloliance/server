/*
  Warnings:

  - You are about to drop the column `role_type` on the `Kyc` table. All the data in the column will be lost.
  - Added the required column `kyc_type` to the `Kyc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kyc" DROP COLUMN "role_type",
ADD COLUMN     "kyc_type" "KycType" NOT NULL;
