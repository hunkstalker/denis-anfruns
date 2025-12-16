---
description: Guía para mantener sincronizados los archivos de traducción (es.mdx, en.mdx, ca.mdx) tras cambios en el contenido original.
---

Sigue este flujo de trabajo cada vez que detectes o realices cambios en una archivo `es.mdx` (español, fuente de verdad).

1.  **Revisión de Calidad (Gramática y Estilo)**:
    -   Antes de traducir, revisa críticamente el texto original en español.
    -   **Ortografía y Puntuación**: Verifica tildes, uso correcto de comas, puntos y mayúsculas.
    -   **Legibilidad**: Si una frase es muy larga o confusa, propón una simplificación para mejorar la lectura.
    -   **Estructura**: Asegura que los párrafos no sean bloques de texto intimidantes; usa saltos de línea donde sea natural.

2.  **Identificar Cambios**:
    -   Lee el contenido actual de `es.mdx`.
    -   Compara con la versión anterior para entender el contexto.

3.  **Verificar Archivos Hermanos**:
    -   Localiza los archivos `en.mdx` (Inglés) y `ca.mdx` (Catalán).
    -   Si no existen, **pregunta al usuario** si desea crearlos ahora.

4.  **Propuesta de Actualización y Traducción**:
    -   **NO** apliques los cambios automáticamente.
    -   Traduce los cambios detectados (y las mejoras gramaticales del paso 1) al Inglés y Catalán.
    -   **Calidad de Traducción**: No traduzcas literal. Adapta las expresiones para que suenen nativas en cada idioma (especialmente en Inglés técnico).

5.  **Confirmación con el Usuario**:
    -   Informa al usuario:
        > "He detectado cambios en `es.mdx`. También he corregido [detalles gramaticales/estilo] en el original. ¿Quieres que actualice las versiones en inglés y catalán?"
    -   Si el usuario aprueba, procede.

6.  **Ejecución**:
    -   Aplica las traducciones manteniendo la misma estructura de componentes (ej. `<CodeTabs>`, imports).
    -   **Importante**: No modifiques claves de metadatos compartidos (`pubDate`, `tags`) que deben estar en `meta.json`.

### Checklist de Calidad Mental
-   ¿Tienen las frases sujeto y predicado claros?
-   ¿Se usan correctamente los signos de puntuación (especialmente comas antes de 'pero', 'aunque')?
-   ¿Es el tono consistente con el resto del sitio (técnico pero cercano)?
