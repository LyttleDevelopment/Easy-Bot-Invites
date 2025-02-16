/*
  Warnings:

  - You are about to drop the column `raid_roles` on the `guild` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "guild" DROP COLUMN "raid_roles",
ADD COLUMN     "pug_roles" TEXT;
