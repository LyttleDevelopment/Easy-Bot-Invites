export function formatInviteType(type: string): string {
  return type
    .replace(/__/g, ' ')
    .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
}

