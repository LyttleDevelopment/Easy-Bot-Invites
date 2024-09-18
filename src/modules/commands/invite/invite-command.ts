import { getGuildMemberKey, GuildMember } from '../../../types';
import {
  ActionRowBuilder,
  APIActionRowComponent,
  APIMessageActionRowComponent,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelType,
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js';
import { Command } from '../../interactions/commands/command-types';
import { getOrCreateGuild } from '../../../database/handlers';
import client from '../../../main';
import { createInvite } from '../../../database/handlers/invite';
import { getDiscordTime } from '../../../utils/get-discord-time';

export const commandName = 'invite' as const;

const commandData: Command = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription('Invite a new member to this guild');

export const inviteCommandData = {
  commandName,
  commandData,
} as const;

async function checkPermissions(
  guildMember: GuildMember,
  interaction: CommandInteraction | ButtonInteraction,
) {
  const guild = await getOrCreateGuild(guildMember.guildId);
  const inviteRoles = guild.admin_roles.split(',');
  const member = client.guilds.cache
    .get(guildMember.guildId)
    ?.members.cache.get(interaction.user.id);
  const allowed = inviteRoles.some((roleId) => member.roles.cache.has(roleId));
  if (!allowed) {
    await interaction.reply({
      content: 'You do not have permission to invite a new member',
      ephemeral: true,
    });
    return false;
  }
  return true;
}

export const activeInviteConversations = new Map<string, CommandInteraction>();

export async function inviteCommand(
  guildMember: GuildMember,
  interaction: CommandInteraction,
) {
  // Check if user has permission to invite a new member
  if (!(await checkPermissions(guildMember, interaction))) return;
  activeInviteConversations.set(getGuildMemberKey(guildMember), interaction);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('invite__guild')
      .setLabel('Invite to Guild')
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId('invite__pug__raid')
      .setLabel('Invite a Pug (Raid Only)')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('invite__pug__stay')
      .setLabel('Invite a Pug (Can Stay)')
      .setStyle(ButtonStyle.Secondary),
  );

  await interaction.reply({
    content: '# Please select the type of invite you want to create\n',
    components: [row],
  });
}

export async function inviteCommandCreate(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
  type: 'guild' | 'pug__raid' | 'pug__stay',
) {
  // Check if user has permission to invite a new member
  if (!(await checkPermissions(guildMember, interaction))) return;
  const commandInteraction: CommandInteraction = activeInviteConversations.get(
    getGuildMemberKey(guildMember),
  );
  await commandInteraction.editReply({
    content: '## Creating a guild invite...',
    components: [],
  });
  await interaction.deferUpdate();

  const guild = await getOrCreateGuild(guildMember.guildId);
  const channelId: string =
    type === 'guild'
      ? guild.guild_rules_channel_id.toString()
      : guild.raid_rules_channel_id.toString();

  // Create a new invite
  const channel = (await client.channels.fetch(channelId)) as TextChannel;
  const permanent = ['guild', 'pug__stay'].includes(type);

  const invite = await channel.createInvite({
    maxAge: permanent ? 0 : 5 * 60 * 60, // 0 = infinite else 5 hours
    maxUses: 0, // 0 = infinite
    unique: true, // unique code
    reason: 'New member invite',
  });

  // Save invite to database
  await createInvite(guildMember.guildId, invite.code, {
    type,
    kick_at: permanent ? null : invite.expiresAt,
    creator: guildMember.userId,
  });

  const niceType = type
    .replace('__', ' ')
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

  await commandInteraction.editReply({
    content: `# Invite created:\n- ${invite.url}\n- Expires: ${
      permanent ? 'Never' : `<t:${getDiscordTime(invite.expiresAt)}:R>`
    }\n- Type: ${niceType}`,
    components: [],
  });
}
