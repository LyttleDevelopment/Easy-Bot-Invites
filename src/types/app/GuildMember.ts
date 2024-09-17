export interface GuildMember {
  guildId: string;
  userId: string;
}

export function getGuildMemberKey(guildMember: GuildMember) {
  return guildMember.userId + '@' + guildMember.guildId;
}
