-- CreateEnum
CREATE TYPE "KycType" AS ENUM ('SUBMITTED', 'SUCCESSFUL', 'UNSUCCESSFUL');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('ID_CARD', 'DRIVERS_LICENSE', 'PASSPORT', 'VOTER_ID');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Kyc" (
    "kyc_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_type" "KycType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "document_type" "DocumentType" NOT NULL,
    "kyc_data" JSONB NOT NULL,

    CONSTRAINT "Kyc_pkey" PRIMARY KEY ("kyc_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_address_key" ON "User"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "Kyc_user_id_key" ON "Kyc"("user_id");

-- AddForeignKey
ALTER TABLE "Kyc" ADD CONSTRAINT "Kyc_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
