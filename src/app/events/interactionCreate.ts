import { Interaction } from 'discord.js';
import { GuildMember } from '../../types';
import {
  onGuildInteractionButton,
  onGuildInteractionCommand,
  onGuildInteractionContextMenuCommand,
  onGuildInteractionModalSubmit,
  onPrivateInteractionButton,
  onPrivateInteractionCommand,
  onPrivateInteractionModalSubmit,
} from '../actions';
import { onPrivateInteractionStringSelectMenu } from '../actions/onPrivateInteractionStringSelectMenu';
import { onGuildInteractionChannelSelectMenu } from '../actions/onGuildInteractionChannelSelectMenu';
import { onPrivateInteractionChannelSelectMenu } from '../actions/onPrivateInteractionChannelSelectMenu';
import { onGuildInteractionStringSelectMenu } from '../actions/onGuildInteractionStringSelectMenu';

async function interactionCreate(interaction: Interaction): Promise<void> {
  // Ignore bots
  if (interaction?.user?.bot) return;

  // Get the user id
  const userId = interaction?.user?.id ?? interaction?.member?.user.id ?? null;
  const inGuild = interaction?.inGuild() ?? !!interaction?.guildId ?? false;

  // Check if the interaction is a DM
  if (!inGuild) {
    // Check if we have a valid user
    if (!userId) return;
    const user = interaction.user;

    // Check if the interaction is a button
    if (interaction.isButton()) {
      return onPrivateInteractionButton(user, interaction);
    }

    // Check if the interaction is a command
    if (interaction.isCommand()) {
      return onPrivateInteractionCommand(user, interaction);
    }

    // Check if the interaction is a modal submit
    if (interaction.isModalSubmit()) {
      return onPrivateInteractionModalSubmit(user, interaction);
    }

    if (interaction.isStringSelectMenu()) {
      return onPrivateInteractionStringSelectMenu(user, interaction);
    }

    if (interaction.isChannelSelectMenu()) {
      return onPrivateInteractionChannelSelectMenu(user, interaction);
    }
  }

  // Check if the interaction is a guild
  if (inGuild) {
    // Build the guildMember
    const guildMember: GuildMember = {
      guildId: interaction?.guild?.id ?? interaction?.guildId,
      userId,
    };

    // Check if we have a valid guildMember
    if (!guildMember?.guildId || !guildMember?.userId) return;

    // Check if the interaction is a button
    if (interaction.isButton()) {
      return onGuildInteractionButton(guildMember, interaction);
    }

    // Check if the interaction is a context menu command
    if (interaction.isContextMenuCommand()) {
      return onGuildInteractionContextMenuCommand(guildMember, interaction);
    }

    // Check if the interaction is a command
    if (interaction.isCommand()) {
      return onGuildInteractionCommand(guildMember, interaction);
    }

    // Check if the interaction is a modal submit
    if (interaction.isModalSubmit()) {
      return onGuildInteractionModalSubmit(guildMember, interaction);
    }

    if (interaction.isStringSelectMenu()) {
      return onGuildInteractionStringSelectMenu(guildMember, interaction);
    }

    if (interaction.isChannelSelectMenu()) {
      return onGuildInteractionChannelSelectMenu(guildMember, interaction);
    }
  }
}

export default interactionCreate;
