-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('CLONING', 'IN_QUEUE', 'BUILDING', 'DEPLOYING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "status" "ProjectStatus" NOT NULL DEFAULT 'CLONING';
