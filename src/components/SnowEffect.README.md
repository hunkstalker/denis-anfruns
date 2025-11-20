# ❄️ Efecto de Nevado Navideño

Componente Svelte que genera un efecto de partículas de nieve cayendo.

## Uso Básico

### En páginas Astro (index.astro, [lang]/index.astro)

```astro
---
import SnowEffect from '../components/SnowEffect.svelte';
---

<html>
  <body>
    <!-- Tu contenido aquí -->
    
    <!-- Añade el efecto de nieve -->
    <SnowEffect client:load />
  </body>
</html>
```

### Con opciones personalizadas

```astro
<!-- Más copos de nieve, más lento -->
<SnowEffect client:load particleCount={100} speed={0.5} />

<!-- Menos copos, más rápido -->
<SnowEffect client:load particleCount={30} speed={2} />
```

## Propiedades

- `particleCount` (número, por defecto: 50) - Cantidad de copos de nieve
- `speed` (número, por defecto: 1) - Multiplicador de velocidad

## Características

✅ Ligero y optimizado con `requestAnimationFrame`  
✅ No interfiere con la interacción del usuario (`pointer-events: none`)  
✅ Responsive - se adapta al tamaño de la ventana  
✅ Los copos se regeneran infinitamente  
✅ Movimiento natural con deriva horizontal  

## Ejemplo de Implementación

Para activar en el landing page, edita `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Header from '../components/Header.astro';
import SocialLinks from '../components/SocialLinks.astro';
import TopProjects from '../components/TopProjects.astro';
import SnowEffect from '../components/SnowEffect.svelte';  // Importar

const lang = 'es';
---

<BaseLayout title='Denis Anfruns Millán - Desarrollador Full Stack'>
  <Nav lang={lang} />
  <div class='flex-1 container'>
    <Header lang={lang} />
    <TopProjects lang={lang} />
    <SocialLinks lang={lang} />
  </div>
  
  <!-- Efecto de nieve navideño -->
  <SnowEffect client:load particleCount={60} speed={0.8} />
</BaseLayout>
```

## Desactivar temporalmente

Para desactivar el efecto, simplemente comenta o elimina la línea:

```astro
<!-- <SnowEffect client:load /> -->
```
