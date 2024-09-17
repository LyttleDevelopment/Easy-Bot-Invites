import { GuildMember } from '../../../types';
import { ButtonInteraction } from 'discord.js';
import { setupCommandValidation1 } from './questions_1_validation';
import {
  getActiveSetupConversations,
  removeActiveSetupConversations,
  sendOk,
} from './setup-command-utils';

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

  removeActiveSetupConversations(guildMember);

  await commandInteraction.editReply({
    content:
      `# Setup Conformation\n\n` +
      'Setup completed, you may close this conversation' +
      suffix,
    components: [],
  });

  await interaction.deferUpdate();
}
