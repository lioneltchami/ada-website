import { env as cloudflareEnv } from "cloudflare:workers";

type RuntimeEnv = Record<string, string | undefined>;

let runtimeEnv: RuntimeEnv = {};

export function setRuntimeEnv(env: unknown) {
  if (env && typeof env === "object") {
    runtimeEnv = env as RuntimeEnv;
  }
}

export function getEnv(name: string): string | undefined {
  const cloudflareValue = (cloudflareEnv as RuntimeEnv | undefined)?.[name];
  if (typeof cloudflareValue === "string" && cloudflareValue.length > 0) {
    return cloudflareValue;
  }

  const runtimeValue = runtimeEnv[name];
  if (typeof runtimeValue === "string" && runtimeValue.length > 0) {
    return runtimeValue;
  }

  const processEnv =
    typeof process !== "undefined" ? process.env?.[name] : undefined;
  if (typeof processEnv === "string" && processEnv.length > 0) {
    return processEnv;
  }

  const metaEnv = (import.meta as any).env?.[name];
  return typeof metaEnv === "string" && metaEnv.length > 0
    ? metaEnv
    : undefined;
}
