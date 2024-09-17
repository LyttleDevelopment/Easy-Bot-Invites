import { GuildMember } from '../../../types';
import { ButtonInteraction } from 'discord.js';
import { setupCommandValidation1 } from './questions_1_validation';
import {
  getActiveSetupConversations,
  removeActiveSetupConversations,
  sendOk,
} from './setup-command-utils';
import { sleep } from '../../../utils/sleep';
import { setGuildValue } from '../../../database/handlers';

const suffix = `\n** **`;

export async function setupCommandRestart(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);

  await interaction.deferUpdate();
  return setupCommandValidation1(guildMember, commandInteraction);
}

export async function setupCommandSave(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  const commandInteraction = asc.interaction;
  await sendOk(commandInteraction);
  await interaction?.deferUpdate();

  await commandInteraction.editReply({
    content: `# Setup Conformation\n\n` + 'Setup Saving...' + suffix,
    components: [],
  });
  const startTime = Date.now();

  // Save the setup
  await setGuildValue(guildMember.guildId, {
    announce_channel_id: asc.setupAnnouncementChannel.id,
    guild_rules_channel_id: asc.setupServerRulesChannel.id,
    raid_rules_channel_id: asc.setupRaidRulesChannel.id,
    welcome_message_guild: asc.setupGuildInviteMessage,
    welcome_message_pug_stay: asc.setupPugInviteMessageStay,
    welcome_message_pug_leave: asc.setupPugInviteMessageLeave,
    admin_roles: asc.setupAdminRoles.map((role) => role.id).join(','),
    guild_roles: asc.setupGuildRoles.map((role) => role.id).join(','),
    pug_roles: asc.setupPugRoles.map((role) => role.id).join(','),
  });

  removeActiveSetupConversations(guildMember);
  await sleep(2500 - (Date.now() - startTime));

  await commandInteraction.editReply({
    content:
      `# Setup Conformation\n\n` +
      'Setup completed, you may close this conversation' +
      suffix,
    components: [],
  });
}
