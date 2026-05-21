export function getAllowedOrigins(requestOrigin: string, configuredOrigin?: string): string[] {
  const primaryOrigin = configuredOrigin || requestOrigin;
  const origins = new Set<string>();

  if (primaryOrigin) origins.add(primaryOrigin);
  if (primaryOrigin?.includes("localhost") || primaryOrigin?.includes("127.0.0.1")) {
    origins.add("http://localhost:4321");
    origins.add("http://127.0.0.1:4321");
  }

  return [...origins];
}

export function isAllowedOrigin(origin: string | null, requestOrigin: string, configuredOrigin?: string): boolean {
  if (!origin) return false;
  return getAllowedOrigins(requestOrigin, configuredOrigin).includes(origin);
}
