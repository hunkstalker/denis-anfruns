---
description: Guía paso a paso para verificar la consistencia entre archivos MDX y meta.json en colecciones de contenido (Devlog/TIL)
---

Sigue estos pasos para asegurar que no haya duplicidad y se respete la estructura de datos compartidos vs. localizados.

1.  **Verificar Estructura de Archivos**:
    -   Cada carpeta de contenido (ej. `/src/content/til/mi-post/` o `/src/content/devlog/mi-proyecto/capitulo-1/`) debe contener:
        -   Un archivo `meta.json` (datos compartidos).
        -   Archivos `.mdx` para cada idioma soportado (ej. `es.mdx`, `en.mdx`, `ca.mdx`) (datos localizados).

2.  **Validar Contenido de `meta.json` (Datos Compartidos)**:
    -   Debe ser un JSON válido.
    -   **DEBE contener**:
        -   `pubDate`: Fecha de publicación ISO (ej. `"2025-12-13T15:00:00Z"`).
        -   `tags`: Array de strings (ej. `["astro", "react"]`).
    -   **PUEDE contener** (si aplica):
        -   `heroImage`: Path a la imagen destacada.
        -   `draft`: Booleano `true`/`false`.
        -   `series` (para Devlog): Nombre de la serie/proyecto.
        -   `order` (para Devlog): Número del capítulo en la serie.
    -   **NO DEBE contener**:
        -   `title`
        -   `description`
        -   `lang`

3.  **Validar Frontmatter de `.mdx` (Datos Localizados)**:
    -   **DEBE contener**:
        -   `title`: Título traducido.
        -   `description`: Descripción breve traducida.
        -   `lang`: Código del idioma (`'es'`, `'en'`, `'ca'`).
    -   **NO DEBE contener** (ya están en `meta.json`):
        -   `pubDate`
        -   `tags`
        -   `heroImage`
        -   `series`

4.  **Comprobación Cruzada (Consistencia)**:
    -   Asegúrate de que no haya claves repetidas entre `meta.json` y el frontmatter del `.mdx`. La fuente de verdad para los datos compartidos es SIEMPRE `meta.json`.
    -   Si encuentras `pubDate` en un `.mdx`, **muévelo** a `meta.json` y bórralo de todos los `.mdx` hermanos.

5.  **Ejemplo Correcto**:

    **`meta.json`**:
    ```json
    {
      "pubDate": "2024-01-20T10:00:00Z",
      "tags": ["tutorial", "css"],
      "heroImage": "./cover.png"
    }
    ```

    **`es.mdx`**:
    ```markdown
    ---
    title: 'Cómo centrar un div'
    description: 'La guía definitiva para centrar elementos en CSS.'
    lang: 'es'
    ---
    ```
