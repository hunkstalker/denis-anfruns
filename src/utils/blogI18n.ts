/**
 * Blog i18n Utilities
 * Helper functions to handle multi-language content with folder-based organization.
 * 
 * Structure:
 *   blog/stardraw/part-1.md        -> Spanish (slug: stardraw/part-1)
 *   blog/stardraw/en/part-1.md     -> English (slug: stardraw/en/part-1)
 *   blog/stardraw/ca/part-1.md     -> Catalan (slug: stardraw/ca/part-1)
 */

export type SupportedLang = 'es' | 'en' | 'ca';

/**
 * Extracts language from a content slug.
 * If slug contains /en/ or /ca/, returns that language. Otherwise 'es'.
 */
export function getLangFromSlug(slug: string): SupportedLang {
  if (slug.includes('/en/') || slug.startsWith('en/')) return 'en';
  if (slug.includes('/ca/') || slug.startsWith('ca/')) return 'ca';
  return 'es';
}

/**
 * Normalizes a slug by removing the language prefix.
 * 'stardraw/en/part-1' -> 'stardraw/part-1'
 * 'stardraw/part-1' -> 'stardraw/part-1' (unchanged)
 */
export function getBaseSlug(slug: string): string {
  return slug
    .replace(/^(en|ca)\//, '')      // Prefix: en/something -> something
    .replace(/\/(en|ca)\//, '/');   // Infix: something/en/part -> something/part
}

/**
 * Builds the correct URL path for a blog post given its slug and target language.
 */
export function getBlogPath(slug: string, targetLang: SupportedLang): string {
  const baseSlug = getBaseSlug(slug);
  if (targetLang === 'es') {
    return `/blog/${baseSlug}/`;
  }
  return `/${targetLang}/blog/${baseSlug}/`;
}
