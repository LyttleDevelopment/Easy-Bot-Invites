-- CreateTable
CREATE TABLE "guild" (
    "guild_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guild_pkey" PRIMARY KEY ("guild_id")
);

-- CreateTable
CREATE TABLE "member" (
    "user_id" BIGINT NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "kick_at" TIMESTAMP(3),
    "is_inviter" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_pkey" PRIMARY KEY ("guild_id","user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_user_id_guild_id_key" ON "member"("user_id", "guild_id");

-- AddForeignKey
ALTER TABLE "member" ADD CONSTRAINT "member_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;
