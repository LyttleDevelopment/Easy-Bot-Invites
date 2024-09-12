import { config } from 'dotenv';

// Load environment variables from .env file, where API keys and passwords are configured
config();

// Check if all required environment variables are set.
const requiredEnvironmentVariables = [
  'NODE_ENV',
  'CLIENT_ID',
  'BOT_TOKEN',
] as const;

// This is a type that is either a string or one of the values in the array
export type Environment =
  | (typeof requiredEnvironmentVariables)[number]
  | string;

// Check if all required environment variables are set.
const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (k) => !Object.keys(process.env).includes(k),
);

// If there are missing environment variables, log them and exit the process.
if (missingEnvironmentVariables.length > 0) {
  console.error(
    'We are missing the following environment variables:',
    missingEnvironmentVariables,
  );
  process.exit(1);
}

// Export the environment variables as a Record
export const environment = process.env as Record<Environment, string>;
