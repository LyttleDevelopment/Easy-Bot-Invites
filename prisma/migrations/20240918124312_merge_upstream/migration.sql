/*
  Warnings:

  - You are about to drop the `guild__invite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "guild__invite" DROP CONSTRAINT "guild__invite_guild_id_fkey";

-- DropTable
DROP TABLE "guild__invite";

-- CreateTable
CREATE TABLE "invite" (
    "invite_id" TEXT NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "type" TEXT,
    "kick_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invite_pkey" PRIMARY KEY ("invite_id")
);

-- AddForeignKey
ALTER TABLE "invite" ADD CONSTRAINT "invite_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;
