import { GuildMember as BotGuildMember } from '../../types';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection,
  GuildMember as DiscordGuildMember,
  Invite as DiscordInvite,
  Role,
  TextChannel,
  User,
} from 'discord.js';
import { checkInvite } from './check-invite';
import { findSingleInvite } from '../../database/handlers/invite';
import {
  deleteMember,
  findSingleGuild,
  findSingleMember,
  setMemberValue,
} from '../../database/handlers';
import { getDiscordTime } from '../../utils/get-discord-time';
import { getMessage } from '../../utils/get-message';
import { Guild, Invite as PrismaInvite } from '@prisma/client';
import client from '../../main';
import { KICK_TIME } from '../../../constants';
import { kickPlayer } from './cleanup-invite-members';

export async function unauthorizedInvite(member: DiscordGuildMember) {
  await kickPlayer(member, 'Unauthorized invite used');

  // Get db guild
  const db_guild = await findSingleGuild(member.guild.id);
  if (!db_guild) return;

  // Log to the admin channel
  const adminChannel = member.guild.channels.cache.get(
    db_guild.announce_channel_id.toString(),
  ) as TextChannel;
  if (!adminChannel) return;
  await adminChannel.send(
    `Unauthorized invite used by ${member.user.tag}, user has been kicked.`,
  );
}

interface AwaitingStay {
  guildMember: BotGuildMember;
  invite: DiscordInvite;
  db_invite: PrismaInvite;
  db_guild: Guild;
}

export const awaitingStay = new Map<string, AwaitingStay>();

export async function onMemberAdd(
  guildMember: BotGuildMember,
  member: DiscordGuildMember,
) {
  const dbMember = await findSingleMember(
    guildMember.guildId,
    guildMember.userId,
  );
  if (dbMember) {
    // Delete member if they are in the database
    await deleteMember(guildMember.guildId, guildMember.userId);
  }
  // Get invite
  const invite = await checkInvite(guildMember);
  if (!invite) return unauthorizedInvite(member);

  // Get db invite
  const db_invite = await findSingleInvite(guildMember.guildId, invite.code);
  if (!db_invite) return unauthorizedInvite(member);

  // Get db guild
  const db_guild = await findSingleGuild(guildMember.guildId);
  if (!db_guild) return unauthorizedInvite(member);

  // Create member in db
  await setMemberValue(guildMember.guildId, member.id, {
    invite_id: db_invite.invite_id,
    kick_at: db_invite.kick_at,
  });

  if (db_invite.type === 'pug__stay') {
    try {
      // Ask user if they want to stay
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('pug__stay__yes')
          .setLabel('Yes')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('pug__stay__no')
          .setLabel('No')
          .setStyle(ButtonStyle.Secondary),
      );

      awaitingStay.set(member.id, {
        guildMember,
        invite,
        db_invite,
        db_guild,
      });

      // Send DM to user
      await member.user.send({
        content: getMessage(
          'Would you like to stay in our Discord after the raid?',
          { user: member.user },
        ),
        components: [row],
      });
    } catch (error) {
      await kickPlayer(member, 'Failed to ask user if they want to stay');

      // Log to the admin channel
      const adminChannel = member.guild.channels.cache.get(
        db_guild.announce_channel_id.toString(),
      ) as TextChannel;
      if (!adminChannel) return;
      await adminChannel.send(
        "Following user has DM's disabled, please ask them to enable DM's and rejoin the server: " +
          member.user,
      );
    }
    return;
  }
  await triggerNewMember(guildMember, true, invite, db_invite, db_guild);
}

export async function onButtonPress(user: User, stays: boolean) {
  const { guildMember, invite, db_invite, db_guild } = awaitingStay.get(
    user.id,
  );
  awaitingStay.delete(user.id);
  return triggerNewMember(guildMember, stays, invite, db_invite, db_guild);
}

export async function triggerNewMember(
  guildMember: BotGuildMember,
  stays: boolean = true,
  invite: DiscordInvite,
  db_invite: PrismaInvite,
  db_guild: Guild,
) {
  const member = client.guilds.cache
    .get(guildMember.guildId)
    ?.members.cache.get(guildMember.userId);

  // Assign roles
  const roleIds: string[] = [];
  let roles: Collection<string, Role> = new Collection();
  switch (db_invite.type) {
    case 'guild':
      db_guild.guild_roles.split(',').map((role) => roleIds.push(role));
      break;
    case 'pug__stay':
      if (stays)
        db_guild.pug_roles.split(',').map((role) => roleIds.push(role));
      break;
  }
  if (roleIds.length > 0) {
    roles = member.guild.roles.cache.filter((role) =>
      roleIds.includes(role.id),
    );
    await member.roles.add(roles);
  }

  // Send welcome message
  let message: string | null = null;
  switch (db_invite.type) {
    case 'guild':
      message = db_guild.welcome_message_guild;
      break;
    case 'pug__stay':
      message = db_guild.welcome_message_pug_stay;
      break;
    case 'pug__raid':
      message = db_guild.welcome_message_pug_leave;
      break;
  }
  let kick_at = null;
  if (db_invite.type === 'pug__stay' && !stays) {
    message = db_guild.welcome_message_pug_leave;
    kick_at = new Date(Date.now() + KICK_TIME);
    await setMemberValue(guildMember.guildId, member.id, {
      invite_id: db_invite.invite_id,
      kick_at: kick_at,
    });
  }
  if (!message) return unauthorizedInvite(member);
  await member.user.send(getMessage(message, { user: member.user }));

  const niceType = db_invite.type
    .replace('__', ' ')
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

  // Log to the admin channel
  const adminChannel = member.guild.channels.cache.get(
    db_guild.announce_channel_id.toString(),
  ) as TextChannel;
  if (!adminChannel) return unauthorizedInvite(member);
  await adminChannel.send(
    `# New Member joined:\n- Name <@${member.id}>\n- Username: ${
      member.user.tag
    }\n- Joined: <t:${getDiscordTime(
      member.joinedAt,
    )}:R>\n- Invite: ${`<${invite.url}>`}\n- Invite Type: ${
      kick_at !== null ? `Pug Raid (Original invite: ${niceType})` : niceType
    }\n- Invite Expires: ${
      kick_at !== null ? `<t:${getDiscordTime(kick_at)}:R>` : 'Never'
    }\n- Invite created by: <@${db_invite.creator}>\n- Roles: ${
      roleIds.length > 0 ? roles.map((role) => role).join(', ') : 'None'
    }`,
  );
}
