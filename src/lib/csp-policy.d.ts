export interface CspEnvironment {
  PUBLIC_SUPABASE_URL?: string;
  PUBLIC_UMAMI_URL?: string;
  PUBLIC_POSTHOG_KEY?: string;
}

export interface CspPolicy {
  directives: string[];
  scriptSources: string[];
  styleSources: string[];
}

export function getCspPolicy(env?: CspEnvironment): CspPolicy;
