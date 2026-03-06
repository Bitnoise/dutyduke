type Options = {
  required: boolean;
};

export function getEnv(name: string, options?: Partial<Options>): string {
  const value = process.env[name];

  if (options?.required && !value) {
    throw new Error(`Missing env: ${name}.`);
  }

  // Return value or empty string (never undefined to maintain string return type)
  return value ?? '';
}
