import { prismaClient } from '../../prisma';
import { getOrCreateGuild } from '../guild';
import type { Invite } from '@prisma/client';
import { Prisma } from '@prisma/client';

export function createInvite(
  guildId: string,
  inviteId: string,
  data: object = {},
): Promise<Invite> {
  return prismaClient.invite.upsert({
    where: {
      guild_id: BigInt(guildId),
      invite_id: inviteId,
      ...data,
    },
    create: {
      guild_id: BigInt(guildId),
      invite_id: inviteId,
      ...data,
    },
    update: {
      guild_id: BigInt(guildId),
      invite_id: inviteId,
      ...data,
    },
  });
}

export function findSingleInvite(
  guildId: string,
  inviteId: string,
): Promise<Invite> {
  return prismaClient.invite.findUnique({
    where: {
      guild_id: BigInt(guildId),
      invite_id: inviteId,
    },
  });
}

export function findSingleInviteByData(
  guildId: string,
  data: Prisma.InviteWhereInput,
): Promise<Invite> {
  return prismaClient.invite.findFirst({
    where: {
      guild_id: BigInt(guildId),
      ...data,
    },
  });
}

export async function getOrCreateInvite(
  guildId: string,
  inviteId: string,
): Promise<Invite> {
  await getOrCreateGuild(guildId);
  return (
    (await findSingleInvite(guildId, inviteId)) ??
    (await createInvite(guildId, inviteId))
  );
}

export async function setInviteValue(
  guildId: string,
  inviteId: string,
  data: Prisma.InviteUpdateInput,
): Promise<Invite> {
  await getOrCreateInvite(guildId, inviteId);

  return prismaClient.invite.update({
    where: {
      guild_id: BigInt(guildId),
      invite_id: inviteId,
    },
    data,
  });
}

export async function findEveryInvite(): Promise<Invite[]> {
  return prismaClient.invite.findMany();
}

export async function deleteInvites(inviteIds: string[]): Promise<void> {
  await prismaClient.invite.deleteMany({
    where: {
      invite_id: {
        in: inviteIds,
      },
    },
  });
}
