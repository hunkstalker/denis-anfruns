/**
 * Blog i18n Utils
 * Funciones auxiliares para gestionar el contenido i18n con organización basada en carpetas.
 * 
 * Estructura de carpetas soportada:
 * blog/artículo/part-1.md        -> Español (slug: artículo/part-1)
 * blog/artículo/en/part-1.md     -> Inglés (slug: artículo/en/part-1)
 * blog/stardraw/part-1/es.mdx    -> Español (slug: stardraw/part-1/es)
 * blog/stardraw/part-1/en.mdx    -> Inglés (slug: stardraw/part-1/en)
 */

export type SupportedLang = 'es' | 'en' | 'ca';

/**
 * Exracción del idioma del contenido del slug.
 * Soporta prefijos (en/...), infijos (.../en/...) y sufijos (.../en).
 */
export function getLangFromSlug(slug: string): SupportedLang {
  if (slug.endsWith('/en') || slug.includes('/en/') || slug.startsWith('en/')) return 'en'
  if (slug.endsWith('/ca') || slug.includes('/ca/') || slug.startsWith('ca/')) return 'ca'
  return 'es'
}

/**
 * Normalizes a slug by removing the language prefix/infix/suffix.
 * 'stardraw/en/part-1' -> 'stardraw/part-1'
 * 'stardraw/part-1/es' -> 'stardraw/part-1'
 */
export function getBaseSlug(slug: string): string {
  // Handle suffix (common in this project: stardraw/part-1/es)
  const cleanSuffix = slug.replace(/\/(?:es|en|ca)$/, '')
  if (cleanSuffix !== slug) return cleanSuffix

  // Handle prefix/infix
  return slug
    .replace(/^(en|ca)\//, '')      // Prefix: en/something -> something
    .replace(/\/(en|ca)\//, '/');   // Infix: something/en/part -> something/part
}