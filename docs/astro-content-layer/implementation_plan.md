# Implementación de Devlog: Astro Content Layer API

**Slug del proyecto**: `astro-content-layer`
**Objetivo**: Crear una serie didáctica explicando la evolución de las Content Collections de Astro al nuevo Content Layer API, enfocado en el "cómo" y el "por qué".

---

## ROADMAP (DOS DEVLOGS INDEPENDIENTES)

### Devlog 1: Dominando el Astro Content Layer
*Enfoque técnico, didáctico y orientado a SEO (Migraciones).*

- [ ] **Capítulo 1: El Salto Evolutivo y el Problema de la RAM**
  - *Enfoque*: Por qué Astro 4 sufría en sitios grandes. Explicación teórica de la base de datos de caché local (`.astro/data-store`) y el fin del encierro en `src/content`. 
  - *Densidad esperada*: Media (Mucha teoría valiosa).
- [ ] **Capítulo 2: Migración y Loaders Nativos (`glob`)**
  - *Enfoque Didáctico ("Antes vs Después")*: Evitaremos teoría abstracta. Se proveerá un código base `src/content/config.ts` obsoleto (Astro 4) mostrando el típico warning de consola. El usuario será guiado paso a paso usando el componente `CodeTabs`: renombrado a `content.config.ts`, eliminación del `type: 'content'` y la implementación del *loader* `glob`.
  - *Densidad esperada*: Corta (Manos a la obra, código rápido y mucho contraste visual).
- [ ] **Capítulo 3: Tipado Extremo y Relaciones con Zod**
  - *Enfoque*: Modelado de Frontmatter. Uso magistral de `z.reference()` para cruzar datos sin duplicarlos (Ej. referencias de un post a una colección de "Categorías" o "Autores").
  - *Densidad esperada*: Alta (Es donde los devs suelen bloquearse al cambiar).
- [ ] **Capítulo 4: Acceso a Datos y Renderizado de MDX**
  - *Enfoque*: La refactorización del frontend. Cómo ha mutado `getCollection` y `getEntry`. Imprimir los datos en bruto y transformar los MDX en HTML mediante el componente `<Content />`.
  - *Densidad esperada*: Media.
- [ ] **Capítulo 5: Enrutamiento Dinámico y Generación de Rutas**
  - *Enfoque*: Creando el directorio masivo con el patrón `[slug].astro`. Cierre del artículo garantizando que el usuario tiene un blog básico funcional. Llamada a la acción al Devlog 2.
  - *Densidad esperada*: Corta/Media.

### Devlog 2: Construyendo una Tempedia (Proyecto Frontend Premium)
*Enfoque en arquitectura UI, efectos visuales y generación dinámica masiva de APIs externas.*

- [ ] **Capítulo 1: Loaders Externos (Secuestrando la Temtem API)**
  - *Enfoque*: Adiós al Markdown. Escribir un loader de tipo API Rest que golpee a `temtem-api.mael.tech` en build-time, validando todo el JSON ajeno en nuestro esquema Zod dictatorial.
- [ ] **Capítulo 2: Arquitectura Base y Tematización por "Tipos"**
  - *Enfoque*: Setup de la plantilla. Lógica algorítmica para inyectar dinámicamente gamas de colores (Tailwind tokens) a cada tarjeta según si la criatura es tipo Fuego, Agua, Mental, etc.
- [ ] **Capítulo 3: Interfaces Premium (Cartas Holográficas en CSS)**
  - *Enfoque*: Masterclass de Frontend. Desarrollo de un componente visual avanzado con reflejos iridiscentes estilo "carta Foil" generados de forma nativa trazando la coordenada del ratón del usuario.
- [ ] **Capítulo 4: Progreso Visual según Lógica Evolutiva**
  - *Enfoque*: Combinar BDD Frontend. Consultar dentro del JSON en qué "Fase evolutiva" estamos. Si es etapa inicial, diseño sobrio mate. Si es etapa final/rara, activación del shader/componente holográfico de alta intensidad.
- [ ] **Capítulo 5: Rutas y Dashboards Estadísticos**
  - *Enfoque*: Expansión de rutado Astro avanzado (`[slug]`). Creación de una vista detallada para cada Temtem dibujando gráficos de características base en radar y renderizando nodos recursivos para su árbol evolutivo.

---

## DOCUMENTACIÓN DE LOS CAPÍTULOS

### Parte 1: El porqué del cambio arquitectónico

**Objetivo Didáctico:**
Asegurar que el lector entienda por qué el equipo de Astro decidió cambiar un sistema que aparentemente "ya funcionaba muy bien" (el sistema restringido a la carpeta `src/content`).

**Conceptos Clave a Desarrollar en el Artículo:**

1. **El Problema de la Memoria (Escalabilidad)**
   - *El contexto:* El sistema original de Astro leía todos tus archivos locales, obtenía su frontmatter y cargaba absolutament todo en la memoria viva (RAM) del proceso de Node.js durante el compilado.
   - *El límite:* Para blogs de 50 artículos era perfecto. Para sitios empresariales o documentaciones de 10,000+ páginas, los tiempos de build se disparaban y los servidores CI/CD se quedaban sin memoria (`Out of Memory`).
   - *La solución (Content Layer):* El nuevo sistema actúa como una caché estática. Extrae, categoriza y persiste los datos en disco (`.astro/data-store`). Así las consultas futuras a `getCollection` son muchísimo más rápidas y no bloquean la RAM de la máquina.

2. **Agnosticismo de Datos (Borrando la barrera entre Local y Remoto)**
   - *El contexto:* Anteriormente, si querías tener una colección de datos traída desde un Headless CMS (Notion, Sanity, Airtable), la API de colecciones no te servía, porque requería estrictamente que los archivos fuesen locales (extensión `.md`, `.json`, etc.). 
   - *El "Hack" anterior:* Los desarrolladores hacían scripts pre-build que usaban `fetch` a las APIs y generaban archivos Markdown estáticos artificialmente para que Astro los leyera.
   - *La solución (Loaders):* Un loader es simplemente una función que devuelve un array de objetos. Al aplicar un "Loader" a tu definición de colección, engañas de forma elegante a Astro. Sea cual sea la fuente original (un `fetch()`, una BDD, o archivos locales), el resto del ecosistema de tu web (tipado de Zod, componentes, render) los consume siempre con la misma API nativa.

3. **La arquitectura de cara al código**
   - Archivo de configuración: Pasamos de `config.ts` (implícito) a `content.config.ts`.
   - Invocación: Pasamos de la recolección automática en carpeta a usar la herramienta formal: `loader: glob({ base: './src/content/devlogs', pattern: '**/*.{md,mdx}' })`

**Flujo esperado para el artículo:**
1. Introducción al problema.
2. Explicación mediante analogía técnica (almacén en memoria vs base de datos cacheada).
3. Explicación del concepto de Loader y cómo esto desacopla la fuente de datos.
4. Conclusión preparatoria para empezar a picar código en la Parte 2.

### Requisitos de SEO y Palabras Clave
Para garantizar que el devlog posicione en búsquedas orgánicas sobre migraciones, nos aseguraremos de incluir el siguiente enfoque en nuestros tags, descripciones y títulos H2/H3, especialmente en la Parte 1 y Parte 5:

- **Términos objetivo**: "Migrar de Astro 4 a Astro 6", "Actualizar Astro 5 a Content Layer", "Migración de Content Collections Astro".
- **Intención de búsqueda**: Captar a desarrolladores que tienen _warnings_ de obsolescencia (`deprecated`) en su código antiguo o quieren actualizar proyectos *legacy*.
- **Estructura H2**: Usaremos títulos explícitos en los artículos como *"¿Qué cambia respecto a Astro 4 y 5?"* o *"Cómo migrar tus colecciones antiguas a Astro 6"*.

---

## REQUISITOS DEL PROYECTO PRÁCTICO (TEMPEDIA)

El devlog culminará con la construcción de una Tempedia funcional de altísima calidad visual (Frontend Premium).

**1. Interfaces Premium (Cartas Holográficas):**
- Las tarjetas del directorio usarán CSS avanzado de **holografía y refractividad** sensibles al movimiento del ratón (estilo Trading Card Game).
- **Sistema de Rareza Evolutiva:** Los efectos dependerán de la fase evolutiva de la criatura extraída de la API:
  - *Fase 1 (Base)*: Diseño limpio, glassmorphism sutil o texturas mate.
  - *Fase 2 (1ª Evolución)*: Reflejo brillante suave, halos de color en los bordes.
  - *Fase 3 o Tipos Raros (Luma)*: Efecto foil/holográfico completo (glare iridiscente), partículas o reflejos dinámicos siguiendo el puntero.

**2. Mapeo de la API al Diseño:**
- Los colores base de las cartas se inyectarán de forma programática detectando el "Type" (Agua, Mental, Digital, etc.).
- Las páginas de destino (rutas dinámicas individuales) incluirán diseño para presentar las "Stats" bases (posibles gráficas tipo radar) y el árbol de evolución.
