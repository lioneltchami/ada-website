export function collectInlineStyleAttributeHashes(
  html: string,
): Promise<string[]>;
export function collectInlineStyleElementHashes(
  html: string,
): Promise<string[]>;
export function normalizeCspMetaPolicy(
  html: string,
  baseDirectives?: string[],
): Promise<string>;
