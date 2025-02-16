-- AlterTable
ALTER TABLE "guild" ADD COLUMN     "announce_channel_id" BIGINT,
ADD COLUMN     "guild_rules_channel_id" BIGINT,
ADD COLUMN     "raid_rules_channel_id" BIGINT,
ADD COLUMN     "welcome_message_guild" TEXT,
ADD COLUMN     "welcome_message_pug_leave" TEXT,
ADD COLUMN     "welcome_message_pug_stay" TEXT;
