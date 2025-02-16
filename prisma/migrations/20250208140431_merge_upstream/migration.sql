-- CreateTable
CREATE TABLE "character" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "guild_id" BIGINT NOT NULL,
    "character_name" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "main_spec" TEXT NOT NULL,
    "off_spec" TEXT NOT NULL,
    "main_or_alt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "character_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "character_user_id_character_name_key" ON "character"("user_id", "character_name");

-- AddForeignKey
ALTER TABLE "character" ADD CONSTRAINT "character_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guild"("guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character" ADD CONSTRAINT "character_user_id_guild_id_fkey" FOREIGN KEY ("user_id", "guild_id") REFERENCES "member"("user_id", "guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;
