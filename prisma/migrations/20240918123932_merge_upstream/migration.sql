-- CreateTable
CREATE TABLE "guild__invite" (
    "invite_id" TEXT NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "type" TEXT,
    "kick_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guild__invite_pkey" PRIMARY KEY ("invite_id")
);

-- AddForeignKey
ALTER TABLE "guild__invite" ADD CONSTRAINT "guild__invite_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;
