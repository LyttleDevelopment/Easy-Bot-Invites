import { getGuildMemberKey, GuildMember } from '../../../types';
import {
  ActiveSetupConversation,
  activeSetupConversations,
  ActiveSetupConversationSettings,
} from './setup-command';
import client from '../../../main';
import { getMessage } from '../../../utils/get-message';
import {
  ActionRowBuilder,
  ActionRowData,
  APIActionRowComponent,
  APIMessageActionRowComponent,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CommandInteraction,
  JSONEncodable,
  MessageActionRowComponentBuilder,
  MessageActionRowComponentData,
} from 'discord.js';
import { sleep } from '../../../utils/sleep';

export function getActiveSetupConversations(guildMember: GuildMember) {
  return activeSetupConversations.get(getGuildMemberKey(guildMember));
}

export function setActiveSetupConversations(
  guildMember: GuildMember,
  value: ActiveSetupConversationSettings,
) {
  const currentActiveConversation = activeSetupConversations.get(
    getGuildMemberKey(guildMember),
  );
  activeSetupConversations.set(getGuildMemberKey(guildMember), {
    ...currentActiveConversation,
    ...value,
  });
}

export function removeActiveSetupConversations(guildMember: GuildMember) {
  activeSetupConversations.delete(getGuildMemberKey(guildMember));
}

export async function sendOk(interaction: CommandInteraction) {
  const currentMessage = await interaction.fetchReply();

  // Add thumps up emoji to end of first line (currentMessage has many lines)
  const content = currentMessage.content.split('\n');
  content[0] += ' 👍';

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('setup-command_ok')
      .setLabel('Loading...')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true),
  );

  await interaction.editReply({
    content: content.join('\n'),
    components: [row],
  });

  await sleep(100);
}

export function getStatus(asc: ActiveSetupConversation) {
  asc = activeSetupConversations.get(getGuildMemberKey(asc.guildMember));
  const status = [];

  if (asc.setupAdminRoles || asc.setupGuildRoles || asc.setupPugRoles) {
    status.push(
      `### Roles\n${
        asc.setupAdminRoles ? `- Admin Roles: ${asc.setupAdminRoles}\n` : ''
      }${asc.setupGuildRoles ? `- Guild Roles: ${asc.setupGuildRoles}\n` : ''}${
        asc.setupPugRoles ? `- Pug Roles: ${asc.setupPugRoles}\n` : ''
      }`,
    );
  }
  if (
    asc.setupAnnouncementChannel ||
    asc.setupServerRulesChannel ||
    asc.setupRaidRulesChannel
  ) {
    status.push(
      `### Channels\n${
        asc.setupAnnouncementChannel
          ? `- Announcement Channel: ${asc.setupAnnouncementChannel}\n`
          : ''
      }${
        asc.setupServerRulesChannel
          ? `- Server Rules Channel: ${asc.setupServerRulesChannel}\n`
          : ''
      }${
        asc.setupRaidRulesChannel
          ? `- Raid Rules Channel: ${asc.setupRaidRulesChannel}\n`
          : ''
      }`,
    );
  }

  if (
    asc.setupGuildInviteMessage ||
    asc.setupPugInviteMessageStay ||
    asc.setupPugInviteMessageLeave
  ) {
    const variables = {
      // Get user from guildMember
      user: client.users.cache.get(asc.guildMember.userId),
    };
    status.push(
      `### Messages\n${
        asc.setupGuildInviteMessage
          ? `- Guild Invite Message: \n\`\`\`${getMessage(
              asc.setupGuildInviteMessage,
              variables,
            )}\`\`\`\n`
          : ''
      }${
        asc.setupPugInviteMessageStay
          ? `- Pug Invite Message (Stay): \n\`\`\`${getMessage(
              asc.setupPugInviteMessageStay,
              variables,
            )}\`\`\`\n`
          : ''
      }${
        asc.setupPugInviteMessageLeave
          ? `- Raid Invite Message (Leave): \n\`\`\`${getMessage(
              asc.setupPugInviteMessageLeave,
              variables,
            )}\`\`\`\n`
          : ''
      }`,
    );
  }

  if (status.length < 1) return '';
  return `## Setup Status:\n\n${status.join('\n')}\n`;
}

export function ascUpdateComponents(
  guildMember: GuildMember,
  components: (
    | JSONEncodable<APIActionRowComponent<APIMessageActionRowComponent>>
    | ActionRowData<
        MessageActionRowComponentData | MessageActionRowComponentBuilder
      >
    | APIActionRowComponent<APIMessageActionRowComponent>
  )[],
) {
  const nav = setupCommandGetNavigation(guildMember);
  if (nav) components.push(nav);
  return components;
}

export function setupCommandGetNavigation(
  guildMember: GuildMember,
): ActionRowBuilder<ButtonBuilder> {
  const asc = getActiveSetupConversations(guildMember);
  if (!asc || !asc.setupCompleted) return null;
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('setup-command_previous')
      .setLabel('Previous')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('setup-command_next')
      .setLabel('Next')
      .setStyle(ButtonStyle.Secondary),
  );
}

export async function setupCommandNavigateNext(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  asc.nextAction(guildMember);
  await interaction.deferUpdate();
}

export async function setupCommandNavigatePrevious(
  guildMember: GuildMember,
  interaction: ButtonInteraction,
) {
  // Update interaction message and buttons
  const asc = getActiveSetupConversations(guildMember);
  asc.previousAction(guildMember);
  await interaction.deferUpdate();
}
