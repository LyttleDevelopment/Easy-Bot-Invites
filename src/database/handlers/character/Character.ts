import { prismaClient } from '../../prisma';
import type { Character } from '@prisma/client';

// Create or update a character
export async function createCharacter(
  guildId: string,
  userId: string,
  characterName: string,
  characterClass: string,
  mainSpec: string,
  offSpec: string,
  mainOrAlt: string,
): Promise<Character> {
  return prismaClient.character.upsert({
    where: {
      user_id_character_name: {
        user_id: BigInt(userId),
        character_name: characterName,
      },
    },
    create: {
      guild_id: BigInt(guildId),
      user_id: BigInt(userId),
      character_name: characterName,
      class: characterClass,
      main_spec: mainSpec,
      off_spec: offSpec,
      main_or_alt: mainOrAlt,
    },
    update: {
      class: characterClass,
      main_spec: mainSpec,
      off_spec: offSpec,
      main_or_alt: mainOrAlt,
    },
  });
}

// Find a single character by name
export function findCharacter(
  userId: string,
  characterName: string,
): Promise<Character | null> {
  return prismaClient.character.findUnique({
    where: {
      user_id_character_name: {
        user_id: BigInt(userId),
        character_name: characterName,
      },
    },
  });
}

// Get all characters for a specific user
export function getUserCharacters(userId: string): Promise<Character[]> {
  return prismaClient.character.findMany({
    where: { user_id: BigInt(userId) },
  });
}

// Get all characters in a guild
export function getGuildCharacters(guildId: string): Promise<Character[]> {
  return prismaClient.character.findMany({
    where: { guild_id: BigInt(guildId) },
  });
}

// Get all characters filtered by class
export function getCharactersByClass(
  guildId: string,
  characterClass: string,
): Promise<Character[]> {
  return prismaClient.character.findMany({
    where: { guild_id: BigInt(guildId), class: characterClass },
  });
}

// Get all characters filtered by spec
export function getCharactersBySpec(
  guildId: string,
  spec: string,
): Promise<Character[]> {
  return prismaClient.character.findMany({
    where: {
      guild_id: BigInt(guildId),
      OR: [{ main_spec: spec }, { off_spec: spec }],
    },
  });
}

// Delete a single character
export async function deleteCharacter(userId: string, characterName: string) {
  return prismaClient.character.delete({
    where: {
      user_id_character_name: {
        user_id: BigInt(userId),
        character_name: characterName,
      },
    },
  });
}

// Delete all characters for a user
export async function deleteAllCharacters(userId: string) {
  return prismaClient.character.deleteMany({
    where: { user_id: BigInt(userId) },
  });
}

// Export all characters in a guild (to be used for CSV export)
export async function exportGuildCharacters(
  guildId: string,
): Promise<Character[]> {
  return prismaClient.character.findMany({
    where: { guild_id: BigInt(guildId) },
    orderBy: [{ class: 'asc' }, { main_spec: 'asc' }],
  });
}

export async function deleteCharacterByName(
  guildId: string,
  characterName: string,
): Promise<number> {
  const result = await prismaClient.character.deleteMany({
    where: {
      guild_id: BigInt(guildId),
      character_name: characterName,
    },
  });

  return result.count; // Returns the number of deleted records
}

export async function deleteCharactersByMember(
  guildId: string,
  userId: string,
): Promise<number> {
  const result = await prismaClient.character.deleteMany({
    where: {
      guild_id: BigInt(guildId),
      user_id: BigInt(userId),
    },
  });

  return result.count; // Returns the number of deleted records
}

export async function deleteCharactersByMembers(
  guildId: string,
  memberIds: string[],
): Promise<number> {
  const result = await prismaClient.character.deleteMany({
    where: {
      guild_id: BigInt(guildId),
      user_id: {
        in: memberIds.map((id) => BigInt(id)),
      },
    },
  });

  return result.count; // Returns the number of deleted records
}
