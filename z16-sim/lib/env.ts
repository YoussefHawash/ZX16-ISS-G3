// Utility to check environment variables
export function getRequiredEnvVar(name: keyof NodeJS.ProcessEnv): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

export function getOptionalEnvVar(
  name: keyof NodeJS.ProcessEnv,
  defaultValue: string = ""
): string {
  return process.env[name] || defaultValue;
}

// Environment configuration
export const config = {
  assemblerUrl: getRequiredEnvVar("ASSEMBLER_URL"),
} as const;
