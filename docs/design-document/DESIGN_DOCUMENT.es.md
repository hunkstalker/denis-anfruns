# Documento de Diseño

Este documento describe los principios básicos de UI/UX y los tokens de diseño del proyecto. Estas reglas garantizan consistencia, escalabilidad y una sensación premium en todo el sitio.

## 1. Sistema de Espaciado (Ritmo)

Utilizamos una cuadrícula estándar basada en 4px. El espaciado no es arbitrario; sigue una escala matemática estricta para crear ritmo visual.

### Huecos de Cuadrícula (Gaps)

Para listas y cuadrículas de tarjetas, usamos una **escala de espaciado responsiva**.

- **Regla**: `grid gap-4 sm:gap-6 lg:gap-8`
- **Por qué**: A medida que crece la pantalla, el contenido necesita más "aire" (espacio negativo) para no verse abigarrado.
  - Móvil: `16px` (gap-4)
  - Tablet: `24px` (gap-6)
  - Escritorio: `32px` (gap-8)

### Relleno de Tarjetas (Breathing Room)

El espaciado interno dentro de las tarjetas también debe escalar.

- **Regla**: `p-4 sm:p-6`
- **Por qué**: Las tarjetas más grandes en escritorio se sienten "vacías" si el relleno es demasiado ajustado. Aumentar el relleno mantiene el equilibrio de densidad visual.

## 2. Componentes de Tarjeta

Las tarjetas (DevLogs, TILs) deben sentirse como hermanas de la misma familia de diseño.

- **Radio del Borde**: `rounded-xl sm:rounded-2xl`
  - Empieza más suave en pantallas pequeñas, aumenta la redondez en diseños más grandes para una sensación moderna y amigable.
- **Sombras**: `shadow-sm hover:shadow-md`
  - La sutileza es clave. Usa sombras iniciales pequeñas que crecen al interactuar para dar feedback de profundidad.
- **Bordes**: Bordes finos y sutiles que se oscurecen ligeramente al pasar el ratón.
  - Claro: `border-zinc-200 hover:border-black/15`
  - Oscuro: `border-zinc-700/50 hover:border-white/15`
- **Transiciones**: `transition-shadow duration-300`
  - Suaviza siempre los cambios de estado. Los saltos bruscos se sienten "baratos".

## 3. Tipografía y Enlaces

La jerarquía del texto guía el ojo del usuario.

- **Enlaces**: Dos tipos de interacciones.
  - **Enlaces en línea**: Decoración de texto estándar o cambio de color.
  - **Enlaces de Acción**: "Leer más", "Ver todo".
    - **Estilo**: Usa `text-[--tangerine-hover]`.
    - **Icono**: Empareja siempre con un icono de flecha (`ArrowUpRight` o `ArrowLink`).
    - **Interacción**: La flecha debe animarse al pasar el ratón (`group-hover:translate-x-1`). Este pequeño movimiento señala "clicable/accionable".

## 4. Animaciones (La Sensación "Premium")

El movimiento debe tener un propósito, no ser decorativo.

- **Entrada Escalonada (Cascada)**:
  - Las listas no deben aparecer todas a la vez. Usa un retraso escalonado (`index * 0.1s`).
  - **Dirección**: Deslizar hacia arriba (`y: 20 -> y: 0`) y aparecer (fade in).
  - **Sincronización**: Si aparecen varias listas una al lado de la otra (ej. Feed del Blog + Sidebar), deben empezar al mismo tiempo ($t=0$).

- **Diseño Mágico (Magic Layout)**:
  - Al filtrar o reordenar, los elementos deben _deslizarse_ a sus nuevas posiciones, no saltar. Usa la propiedad `layout` de `framer-motion`.

## 5. Internacionalización (i18n)

- **Regla de Oro**: **NADA de texto "hardcoded"**.
  - Cada cadena visible debe venir de `src/i18n/ui.ts`.
  - Los componentes deben aceptar etiquetas a través de props (ej. `labels={{ readNote: t(...) }}`) para permanecer puros y agnósticos al idioma.

---

_Adhiérete a estas reglas para todos los componentes futuros para mantener la integridad del diseño del sitio._
