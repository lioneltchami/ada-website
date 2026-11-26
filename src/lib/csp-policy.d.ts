export interface CspEnvironment {
  PUBLIC_SUPABASE_URL?: string;
  PUBLIC_UMAMI_URL?: string;
  PUBLIC_GOATCOUNTER_ENDPOINT?: string;
}

export interface CspPolicy {
  directives: string[];
  scriptSources: string[];
  styleSources: string[];
}

export function getCspPolicy(env?: CspEnvironment): CspPolicy;

export function getGoatCounterEndpoint(value?: string): string | null;
