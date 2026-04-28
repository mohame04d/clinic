-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('SIGN_UP', 'PASSWORD_RESET');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otpPurpose" "OtpPurpose";
