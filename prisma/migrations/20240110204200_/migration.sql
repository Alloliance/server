/*
  Warnings:

  - A unique constraint covering the columns `[allo_profile_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "allo_profile_id" TEXT NOT NULL DEFAULT '1';

-- CreateIndex
CREATE UNIQUE INDEX "User_allo_profile_id_key" ON "User"("allo_profile_id");
