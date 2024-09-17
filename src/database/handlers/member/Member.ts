import { prismaClient } from '../../prisma';
import { getOrCreateGuild } from '../guild';
import type { Member } from '@prisma/client';
import { Prisma } from '@prisma/client';

export function createMember(guildId: string, userId: string): Promise<Member> {
  return prismaClient.member.upsert({
    where: {
      guild_id_user_id: {
        guild_id: BigInt(guildId),
        user_id: BigInt(userId),
      },
    },
    create: {
      guild_id: BigInt(guildId),
      user_id: BigInt(userId),
    },
    update: {
      guild_id: BigInt(guildId),
      user_id: BigInt(userId),
    },
  });
}

export function findSingleMember(
  guildId: string,
  userId: string,
): Promise<Member> {
  return prismaClient.member.findUnique({
    where: {
      user_id_guild_id: {
        guild_id: BigInt(guildId),
        user_id: BigInt(userId),
      },
    },
  });
}

export async function getOrCreateMember(
  guildId: string,
  userId: string,
): Promise<Member> {
  await getOrCreateGuild(guildId);
  return (
    (await findSingleMember(guildId, userId)) ??
    (await createMember(guildId, userId))
  );
}

export async function setMemberValue(
  guildId: string,
  userId: string,
  data: Prisma.MemberUpdateInput,
): Promise<Member> {
  await getOrCreateMember(guildId, userId);

  return prismaClient.member.update({
    where: {
      guild_id_user_id: {
        guild_id: BigInt(guildId),
        user_id: BigInt(userId),
      },
    },
    data,
  });
}

export async function findEveryMember(
  guildId: string,
  data: Prisma.MemberWhereInput,
): Promise<Member[]> {
  return prismaClient.member.findMany({
    where: {
      guild_id: BigInt(guildId),
      ...data,
    },
  });
}
