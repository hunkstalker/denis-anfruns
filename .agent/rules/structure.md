---
trigger: always_on
---

# Estructura del Proyecto

## 1. Configuración y Tooling
Archivos en la raíz que definen la configuración del entorno, herramientas de construcción y dependencias.

- `.gitignore` - Archivos y directorios ignorados por Git.
- `.gitmodules` - Configuración de submódulos de Git (packages externos).
- `.node-version` - Define la versión de Node.js utilizada (>=24.0.0).
- `.npmrc` - Configuración del gestor de paquetes npm/pnpm.
- `.prettierrc` - Reglas de formato de código.
- `astro.config.mjs` - Configuración principal de Astro (integraciones, i18n, build).
- `denis-anfruns.code-workspace` - Configuración del espacio de trabajo de VS Code.
- `eslint.config.mjs` - Configuración de linting (código limpio) con ESLint 9.
- `package.json` - Manifiesto del proyecto (scripts, dependencias).
- `pnpm-lock.yaml` - Árbol de versiones de dependencias congelado.
- `pnpm-workspace.yaml` - Definición del monorepo (workspace).
- `tailwind.config.cjs` - Configuración del sistema de diseño (Tailwind CSS).
- `tsconfig.json` - Configuración del compilador TypeScript.

## 2. Código Fuente (`src/`)
El núcleo de la aplicación donde reside todo el código de producción.

### Arquitectura y Enrutamiento
Componentes estructurales y definición de rutas.
- `pages/` - **Rutas**: Define las URLs de la web (sistema de rutas de Astro). Incluye endpoints API y páginas localizadas.
- `layouts/` - **Plantillas**: Estructuras base HTML compartidas (ej. `Base`, `Page`, `Post`) que envuelven las páginas.

### Sistema de Diseño y UI Core
Elementos visuales y componentes base de la interfaz.
- `styles/` - CSS global, fuentes y variables de diseño.
- `icons/` - Recursos gráficos SVG y componentes de iconos.
- `components/ui/` - **Átomos/Moléculas**: Componentes base pequeños y reutilizables (Botones, Inputs, Badges).
- `components/common/` - Componentes genéricos de uso común en toda la app.
- `components/layout/` - Componentes estructurales de la UI (Header, Footer, Head).

### Lógica y Estado
Herramientas para la lógica de negocio y gestión de datos.
- `hooks/` - Hooks personalizados de React (lógica de componentes reutilizable).
- `stores/` - Estado global de la aplicación (usando Nano Stores).
- `utils/` - Funciones de utilidad pura (formateo, validación, helpers).
- `types/` - Definiciones de tipos TypeScript globales (`d.ts`).
- `i18n/` - Configuración de internacionalización y diccionarios de traducción.

### Capa de Datos
Fuentes de datos estáticos y dinámicos.
- `content/` - **Colecciones de Contenido**: Archivos Markdown/MDX que alimentan el blog, TIL, etc.
- `data/` - Archivos JSON con datos estáticos de configuración o contenido no-colección.

## 3. Módulos y Features Principales
El código específico de cada sección funcional del sitio se organiza modularmente (principalmente dentro de `src/components/`).

- **Blog / Devlog** (`src/components/devlog/`): Componentes específicos para la visualización de artículos y listas del diario de desarrollo.
- **TIL - Today I Learned** (`src/components/til/`): Lógica para la sección de notas rápidas de aprendizaje, incluyendo filtrado y visualización.
- **Búsqueda** (`src/components/search/`): Widgets y lógica para el buscador del sitio (integrado con Pagefind).
- **Componentes MDX** (`src/components/mdx/`): Componentes interactivos diseñados para incrustarse directamente dentro del contenido Markdown (ej. Callouts, Gráficos).
- **About/Experimentos** (`src/components/about/`, `...experiments/`): Secciones específicas o páginas estáticas ricas.

## 4. Automatización y Scripts
Scripts para mantener la calidad y consistencia del proyecto.

### Scripts de Mantenimiento (`/scripts`)
Se ejecutan en Node.js desde la terminal o CI/CD (usando `pnpm <script>`).
- `menu.mjs` - CLI interactiva para facilitar el uso de los scripts (`pnpm menu`).
- `verify-content.mjs` - Valida reglas estrictas en el contenido (integridad, metadatos).
- `normalize-content.mjs` - Reescribe y estandariza formato de archivos de contenido.
- `check-drafts.mjs` - Reporte de contenidos en estado borrador.

### Scripts de Cliente (`src/scripts`)
Se compilan y envían al navegador del usuario.
- `generate-stress-content.js` - Utilidades para generación de contenido en cliente (si aplica).

## 5. Paquetes Internos (`packages/`)
Módulos aislados que funcionan como dependencias internas del workspace.
- `astro-search-badges` - Integración personalizada para badges y búsquedas.
