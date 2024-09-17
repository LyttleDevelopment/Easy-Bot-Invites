/**
 * Get the message without prefix, or the default one.
 * @param guildId
 * @param key
 * @param variables
 */
export function getMessage(message: string, variables: object): string {
  // Convert to Record<string, Primitive>
  const _variables = variables as Record<string, Primitive>;

  // Return message
  return message.insert(_variables);
}
