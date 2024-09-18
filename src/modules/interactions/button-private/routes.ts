import { ButtonInteraction, User } from 'discord.js';
import { onButtonPress } from '../../invite/invite';

/**
 * All routes for button presses
 * customId: Function
 */
export const buttonRoutes: ButtonRoutes = {
  pug__stay__yes: async (user: User, interaction: ButtonInteraction) => {
    await interaction.deferUpdate();
    await interaction.message.delete();
    await onButtonPress(user, true);
  },
  pug__stay__no: async (user: User, interaction: ButtonInteraction) => {
    await interaction.deferUpdate();
    await interaction.message.delete();
    await onButtonPress(user, false);
  },
};

/**
 * All routes/functions for button presses interface
 */
export interface ButtonRoutes {
  [key: string]: (user: User, interaction: ButtonInteraction) => void;
}
