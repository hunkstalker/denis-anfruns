---
trigger: always_on
---

# Technology Stack

Documentación de las tecnologías clave utilizadas en el proyecto y la justificación de su elección.

## Core & Framework
- **[Astro](https://astro.build/) (v5)**: El framework principal del sitio.
  - **Por qué**: Ofrece rendimiento excepcional mediante "Islands Architecture" (Zero JS by default). Permite mezclar contenido estático (ideal para blogs/devlogs) con componentes interactivos solo donde se necesita.
  - **Uso**: Enrutamiento, generación estática (SSG), manejo de colecciones de contenido y optimización de assets.

- **[React](https://react.dev/) (v19)**: Biblioteca de UI para componentes interactivos.
  - **Por qué**: Ecosistema robusto y flexibilidad para crear UIs complejas (como el editor de código o buscadores).
  - **Uso**: "Islas" interactivas dentro de Astro (ej. `client:load` para la barra de búsqueda o `TSEditor`).

## Lenguajes & Tipado
- **[TypeScript](https://www.typescriptlang.org/) (v5)**: Superset tipado de JavaScript.
  - **Por qué**: Garantiza seguridad de tipos, mejora la experiencia de desarrollo (autocompletado, refactorización segura) y reduce bugs en tiempo de ejecución.
  - **Uso**: Estricto en todo el proyecto (`strict: true`). Typed props en componentes React y Astro.

## Estilos & Diseño
- **[Tailwind CSS](https://tailwindcss.com/) (v3)**: Framework CSS utilitario.
  - **Por qué**: Desarrollo rápido de UI sin cambiar de contexto, mantenimiento sencillo y diseño consistente mediante sistema de diseño (tokens).
  - **Uso**: Estilizado de todos los componentes. Configurado con plugins como `@tailwindcss/typography` para el contenido prose (MDX).

- **CSS Variables**: Para tematización (Modo Claro/Oscuro) y colores semánticos definidos en `src/styles/global.css`.

- **[Framer Motion](https://www.framer.com/motion/)**: Biblioteca de animaciones para React.
  - **Por qué**: API declarativa y potente para animaciones complejas y gestos.
  - **Uso**: Transiciones de página, animaciones de micro-interacciones (ej. botones, tarjetas).

## Gestión de Contenido (CMS as Code)
- **[MDX](https://mdxjs.com/)**: Markdown con JSX.
  - **Por qué**: Permite escribir contenido rico mezclando narrativa con componentes interactivos (ej. demos en vivo dentro de un post).
  - **Uso**: Artículos del Devlog, entradas de TIL y páginas ricas.

- **[Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)**: Sistema de gestión de contenido de Astro.
  - **Por qué**: Valida el esquema del contenido (frontmatter) usando Zod, garantizando que todos los datos necesarios existan y tengan el formato correcto.

- **[Pagefind](https://pagefind.app/)**: Motor de búsqueda estático.
  - **Por qué**: Búsqueda full-text ultra rápida que se ejecuta en el cliente sin necesidad de backend/servidor. Indexa el sitio estático construido.
  - **Uso**: Búsqueda global (Cmd+K).

## Gestión de Estado
- **[Nano Stores](https://github.com/nanostores/nanostores)**: Biblioteca de estado agnóstica y diminuta.
  - **Por qué**: Ideal para compartir estado entre islas de UI frameworks distintos o entre componentes de Astro y React sin el peso de Context/Redux.
  - **Uso**: Estado global ligero (ej. estado del menú, preferencias de usuario).

## Herramientas & Developer Experience (DX)
- **[pnpm](https://pnpm.io/)**: Gestor de paquetes.
  - **Por qué**: Rápido, eficiente en espacio de disco y soporte nativo excelente para monorepos/workspaces.

- **[ESLint](https://eslint.org/) (v9)**: Linter de código.
  - **Por qué**: Asegura consistencia de código y encuentra errores.
  - **Uso**: configuración "Flat Config" moderna, con reglas para Astro, React, Tailwind y A11y.

- **[Prettier](https://prettier.io/)**: Formateador de código.
  - **Por qué**: Termina con los debates sobre estilo de código. Formato automático al guardar.

- **[Monaco Editor](https://github.com/suren-atoyan/monaco-react)**: Componente de editor de código (VS Code en web).
  - **Por qué**: Proporciona una experiencia de edición de código real para los ejemplos interactivos y sandboxes.
