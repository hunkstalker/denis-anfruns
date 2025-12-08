/**
 * Blog i18n Utils
 * Funciones auxiliares para gestionar el contenido i18n con organización basada en carpetas.
 * 
 * Estructura de carpetas:
 * blog/artículo/part-1.md        -> Español (slug: artículo/part-1)
 * blog/artículo/en/part-1.md     -> Inglés (slug: artículo/en/part-1)
 * blog/artículo/ca/part-1.md     -> Catalán (slug: artículo/ca/part-1)
 */

export type SupportedLang = 'es' | 'en' | 'ca';

/**
 * Exracción del idioma del contenido del slug.
 * Si el slug contiene /en/ o /ca/, devuelve el idioma correspondiente, sino devuelve 'es'.
 */
export function getLangFromSlug(slug: string): SupportedLang {
  if (slug.includes('/en/') || slug.startsWith('en/')) return 'en'
  if (slug.includes('/ca/') || slug.startsWith('ca/')) return 'ca'
  return 'es'
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