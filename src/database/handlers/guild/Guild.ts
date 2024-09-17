import { prismaClient } from '../../prisma';
import type { Guild } from '@prisma/client';

export function createGuild(guildId: string): Promise<Guild> {
  return prismaClient.guild.upsert({
    where: {
      guild_id: BigInt(guildId),
    },
    create: {
      guild_id: BigInt(guildId),
    },
    update: {
      guild_id: BigInt(guildId),
    },
  });
}

export function findSingleGuild(guildId: string): Promise<Guild> {
  return prismaClient.guild.findUnique({
    where: {
      guild_id: BigInt(guildId),
    },
  });
}

export async function getOrCreateGuild(guildId: string): Promise<Guild> {
  return (await findSingleGuild(guildId)) ?? (await createGuild(guildId));
}
