# Guía de Alpine.js en este Proyecto

Este documento explica cómo se utiliza [Alpine.js](https://alpinejs.dev/) en este proyecto, específicamente en la página de proyectos (`src/pages/[lang]/projects.astro`).

Alpine.js es un framework de JavaScript ligero que te permite añadir interactividad a tu HTML de forma sencilla.

## Instalación y Configuración

En este proyecto, Alpine.js se importa y se inicia manualmente en el script del componente Astro:

```javascript
// src/pages/[lang]/projects.astro
import Alpine from 'alpinejs';
Alpine.start();
```

Esto permite que Alpine escanee el DOM y active los componentes definidos.

## Directivas Utilizadas

Aquí tienes las directivas principales que usamos y qué hacen:

### 1. `x-data` (Estado)

Define un "componente" Alpine y su estado (datos). Todo lo que esté dentro de este `div` tiene acceso a las variables definidas.

```html
<div x-data="{ selectedFilter: 'all' }">
  <!-- ... -->
</div>
```
*   **Qué hace:** Crea un ámbito donde existe la variable `selectedFilter`, inicializada en `'all'`.

### 2. `x-on` (Eventos)

Escucha eventos del DOM (como clicks). La sintaxis corta es `@`, pero en Astro/JSX recomendamos usar la sintaxis completa `x-on:` para evitar conflictos de sintaxis.

```html
<button x-on:click="selectedFilter = 'all'">
  Todos
</button>
```
*   **Qué hace:** Cuando se hace click en el botón, cambia el valor de `selectedFilter` a `'all'`.
*   **Nota:** También verás `x-on:click="selectedFilter = $el.dataset.tech"`. `$el` se refiere al elemento actual, permitiendo acceder a sus atributos de datos (`data-tech`).

### 3. `x-bind` (Atributos Dinámicos)

Vincula atributos HTML a expresiones de JavaScript. La sintaxis corta es `:`, pero en Astro/JSX usamos `x-bind:`.

```html
<button 
  x-bind:class="selectedFilter === 'all' ? 'bg-emerald-600' : 'bg-zinc-100'"
>
```
*   **Qué hace:** Aplica la clase `bg-emerald-600` si `selectedFilter` es 'all', de lo contrario aplica `bg-zinc-100`. Esto hace que los estilos reaccionen a los cambios de estado.

### 4. `x-show` (Visibilidad)

Muestra u oculta un elemento basándose en una condición (usando `display: none`).

```html
<div x-show="selectedFilter === 'all' || ...">
  <!-- Contenido del proyecto -->
</div>
```
*   **Qué hace:** El elemento solo se ve si el filtro es 'all' o si el proyecto coincide con el filtro seleccionado.

### 5. `x-transition` (Animaciones)

Añade transiciones suaves cuando un elemento se muestra u oculta con `x-show`.

```html
<div x-show="..." x-transition>
```
*   **Qué hace:** Alpine aplica automáticamente clases de transición (fade in/out) por defecto.

### 6. `x-init` y `$watch` (Efectos Secundarios)

`x-init` ejecuta código cuando el componente se inicializa. `$watch` permite reaccionar a cambios en una variable.

```html
<div 
  x-data="{ hasVisibleProjects: true }"
  x-init="$watch('selectedFilter', () => { ... })"
>
```
*   **Qué hace:** En nuestro caso, observamos `selectedFilter`. Cada vez que cambia, recalculamos si hay proyectos visibles (`hasVisibleProjects`) para mostrar el mensaje de "No hay proyectos" si es necesario.

## Recursos para Aprender Más

*   **Documentación Oficial:** [https://alpinejs.dev/](https://alpinejs.dev/) - Es excelente y muy fácil de leer.
*   **Alpine.js Weekly:** [https://alpinejs.codewithhugo.com/newsletter/](https://alpinejs.codewithhugo.com/newsletter/) - Novedades y trucos.

## Resumen del Flujo en Proyectos

1.  El contenedor principal tiene `x-data="{ selectedFilter: 'all' }"`.
2.  Los botones de filtro cambian esa variable con `x-on:click`.
3.  Los botones cambian de color (activo/inactivo) gracias a `x-bind:class`.
4.  Las tarjetas de proyecto se muestran u ocultan con `x-show` dependiendo de si coinciden con el filtro.
5.  Un observador en `x-init` verifica si quedaron proyectos visibles para mostrar un mensaje de "vacío" si fuera necesario.
