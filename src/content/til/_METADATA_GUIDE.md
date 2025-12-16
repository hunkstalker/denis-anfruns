# TIL Metadata System Guide

This project handles metadata for "Today I Learned" (TIL) posts using a hierarchical system that merges `meta.json` files with individual MDX frontmatter.

## How it Works

The system loads a `meta.json` file from the directory where the MDX file resides. This allows defining shared metadata for a series or a multi-language post in a single place.

### Precedence Rules

1.  **`meta.json` (Highest Priority)**
    *   Fields defined here **override** or **merge** with frontmatter.
    *   **Mandatory for:** `seriesTitle`, `seriesDescription` (localized), `tags` (merged), `icon`.
    *   **Recommended for:** `draft`, `new`, `pubDate` (if shared), `series` slug.

2.  **MDX Frontmatter (Specific Overrides)**
    *   Used for unique content: `title`, `description`, `lang`.
    *   Can define `pubDate` if different per language (rare).
    *   Can define `tags` which are **added** to the `meta.json` tags.

### File Structure Example

```
src/content/til/typescript-basics/part-1/
├── meta.json  <-- Shared metadata (Series info, Draft status, Dates)
├── es.mdx     <-- Content (Spanish)
├── en.mdx     <-- Content (English)
└── ca.mdx     <-- Content (Catalan)
```

### `meta.json` Schema

```json
{
  "seriesTitle": {
    "es": "Título en Español",
    "en": "Title in English",
    "ca": "Títol en Català"
  },
  "seriesDescription": {
    "es": "Descripción...",
    "en": "Description...",
    "ca": "Descripció..."
  },
  "tags": ["tag1", "tag2"],
  "pubDate": "2025-12-25T10:00:00Z",
  "new": true, 
  "draft": true,
  "icon": "typescript" 
}
```

### Minimal Frontmatter Example (`es.mdx`)

```yaml
---
title: 'My Specific Post Title'
description: 'Specific description for this post.'
lang: 'es'
---
```

## Loader Logic

The logic is located in `src/utils/til-content.ts`.
It automatically looks for `../content/til/${folder}/meta.json` relative to the file.
