export const env = {
  PORT: Number(process.env.PORT ?? 3000),
  KAKAO_REST_API_KEY: process.env.KAKAO_REST_API_KEY ?? '',
  AIR_QUALITY_API_KEY: process.env.AIR_QUALITY_API_KEY ?? '',
} as const;

export function requireEnv(key: keyof typeof env) {
  const value = env[key];
  if (!value) {
    throw new Error(`[env] Missing required env: ${String(key)}`);
  }
  return value;
}
