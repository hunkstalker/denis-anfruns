---
description: Guía paso a paso para estandarizar y optimizar código SVG para el proyecto
---

Sigue estos pasos para limpiar y estandarizar cualquier código SVG que se añada al proyecto (especialmente iconos).

1.  **Limpieza de la etiqueta `<svg>`**:
    -   Asegúrate de que tenga el atributo `viewBox="0 0 24 24"` (o el que corresponda al diseño original, pero busca consistencia en 24x24).
    -   **ELIMINA** los atributos `width` y `height`. El tamaño se debe controlar siempre mediante CSS (clases de Tailwind como `w-6 h-6` o `size-6`).
    -   Añade `fill="none"` si es un icono de línea (stroked).
    -   Añade `stroke="currentColor"` para que herede el color del texto.
    -   Define `stroke-width="2"`, `stroke-linecap="round"` y `stroke-linejoin="round"` para mantener el estilo visual consistente.
    -   Elimina cualquier atributo `class` harcodeado dentro del SVG (las clases deben pasarse desde el componente padre).

2.  **Limpieza del contenido (`path`, `circle`, etc.)**:
    -   Si el `path` tiene `stroke="#000"` o similar, cámbialo a `currentColor` o elimínalo si ya está definido en la etiqueta `<svg>` padre.
    -   Elimina comentarios `<!-- ... -->` o metadatos innecesarios (`data-name`, `id` inútiles).

3.  **Formato**:
    -   Devuelve el código SVG en un formato conciso pero legible (puedes usar una sola línea si es muy corto, o indentado si es complejo).

4.  **Iconos de Stack Tecnológico (Tech Stack)**:
    -   Existen iconos específicos usados para representar tecnologías (ej. `react.svg`, `typescript.svg`, `astro-logo.svg`).
    -   **Consistencia de Tamaño**: Aunque el `viewBox` sea 24x24, es CRÍTICO que el logo visualmente ocupe el mismo espacio "relleno" que los demás.
        -   Evita que unos logos toquen los bordes y otros tengan mucho padding interno.
        -   Intenta que todos mantengan un margen visual similar (aprox. 2px de padding interno salvo que la forma requiera más).
    -   **Ubicación**: Idealmente, plantéate moverlos a una subcarpeta `src/icons/tech/` si creas nuevos, para tenerlos "señalizados" y separados de los iconos de UI generales.

### Ejemplo:

**Entrada (Incorrecto):**
```xml
<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 12H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**Salida (Estandarizado):**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 12H19" />
</svg>
```
