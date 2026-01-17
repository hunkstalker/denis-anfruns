---
name: Gestión de Devlogs Didácticos
description: Protocolo para la creación asistida de proyectos de aprendizaje (Devlogs). Define el manejo del roadmap, tono didáctico técnico, backups de planificación y flujo estricto de traducción.
---

# Protocolo de Gestión de Devlogs

El usuario utiliza los Devlogs como una herramienta de aprendizaje activo. No "escribe cursos", sino que **construye proyectos** (ej. un videojuego en Godot) guiado por la IA, documentando el proceso paso a paso con un enfoque didáctico detallado.

## 1. Planificación y Roadmap
El núcleo de cada proyecto reside en su plan de implementación.

- **Ubicación**: `docs/[slug-proyecto]/implementation_plan.md`
- **Lectura Contextual**: 
  - Al iniciar una sesión, LEE `implementation_plan.md` para cargar los objetivos.
  - **Historial**: Si estás trabajando en un capítulo avanzado (ej. Parte 6), debes tener en cuenta el código y las decisiones tomadas en los capítulos anteriores (Partes 1-5). Usa `view_file` o `grep_search` para consultar cómo se implementaron mecánicas previas si es necesario para mantener la coherencia.
- **Backups (Regla Legacy)**:
  - Si se requieren cambios significativos en el diseño o roadmap del proyecto, **ANTES** de sobrescribir el archivo:
  1. Crea la carpeta `legacy` si no existe: `docs/[slug-proyecto]/legacy/`.
  2. Copia el `implementation_plan.md` actual a esa carpeta con fecha: `implementation_plan_YYYY-MM-DD.md`.
  3. Procede a actualizar el plan principal con las nuevas ideas.

## 2. Consulta Pre-Desarrollo (Fase 0)
Antes de crear contenido con múltiples ejemplos o patrones, SIEMPRE consulta al usuario.

- **Disparador**: Cuando el capítulo requiera crear varios ejemplos (ej. patrones de movimiento, tipos de enemigos, variantes de un sistema).
- **Objetivo**: Definir con el usuario EXACTAMENTE qué ejemplos crear, su alcance y prioridad.
- **Proceso**:
  1. Presenta tu propuesta inicial de ejemplos/patrones.
  2. Pide feedback explícito: "¿Estos son los ejemplos que quieres? ¿Falta o sobra alguno?"
  3. Itera hasta tener claridad antes de escribir código/contenido.
- **Motivo**: Evitar trabajo que luego no cuadre con la visión del proyecto. Es más eficiente alinear primero que rehacer después.

## 3. Desarrollo del Contenido (Fase A)
El trabajo se realiza iterativamente capítulo a capítulo.

### Reglas de Escritura
1. **Single Source**: Trabaja ÚNICAMENTE en `es.mdx`. Ignora los otros idiomas hasta la fase de traducción.
2. **Enfoque Didáctico y Técnico**:
   - El objetivo es que el usuario aprenda profundamente cómo funcionan las cosas.
   - **Explicación Previa**: NUNCA muestres un bloque de código sin antes haberlo desglosado.
   - **Línea a Línea**: Explica la lógica, sintaxis y por qué se hace así (línea a línea si es complejo) **antes** de presentar el bloque de código final.
   - **Ejemplos**: Usa ejemplos aislados si es necesario para clarificar conceptos difíciles.
3. **Profundidad sobre Brevedad**:
   - El usuario ya tiene conocimientos generales. Busca entender en PROFUNDIDAD.
   - **Nuevos métodos de GDScript**: Si aparece un método nuevo (`abs()`, `clamp()`, `lerp()`, etc.), explícalo con detalle: qué hace, parámetros, casos de uso.
   - **Matemáticas**: Desarrolla las fórmulas paso a paso. No asumas que el lector sabe trigonometría o álgebra lineal.
   - **Shaders**: Explica cada línea de GLSL. La GPU es un mundo nuevo para el usuario.
   - **No hay límite de longitud**: Si un capítulo necesita 500-600 líneas para explicar bien un tema, hazlo. Mejor un capítulo denso que uno superficial.
4. **Patrón de Desglose de Código (Por qué / Para qué / Cómo)**:
   - Cada línea o bloque de código en un desglose debe cubrir **tres conceptos**:
     - **Por qué**: El problema que resuelve o la necesidad que lo origina.
     - **Para qué**: El objetivo o resultado que buscamos al implementarlo.
     - **Cómo**: La implementación técnica, de dónde sale cada valor, y el cálculo si aplica.
   - **IMPORTANTE**: No uses los títulos "Por qué/Para qué/Cómo" de forma literal y repetitiva. 
     - ❌ **Mal**: "*Por qué: X. Para qué: Y. Cómo: Z.*"
     - ✅ **Bien**: "*Necesitamos X para evitar Y. Para ello, usamos la función Z que calcula...*"
   - La explicación debe fluir de forma natural, integrando estos tres aspectos en la narrativa o en puntos de lista descriptivos sin etiquetas robóticas.

5. **Aprendizaje en Espiral (Repetición Progresiva)**:
   - Los conceptos se introducen de forma ligera la primera vez ("esto hace X").
   - Cuando vuelven a aparecer en capítulos posteriores, se profundiza ("¿recuerdas X? Ahora veamos POR QUÉ funciona así").
   - Es válido y deseable repetir explicaciones si aportan nuevo contexto o profundidad.
   - Ejemplo: `sin()` se introduce en Part 5 como "oscila de -1 a 1". En Part 6 se puede profundizar en "2π = ciclo completo, relación con grados".

## 4. Traducción y Cierre (Fase B)
La traducción es un proceso destructivo (sobrescribe archivos destino basándose en el origen).

- **Disparador**: NUNCA inicies la traducción o sincronización automáticamente. Hazlo **SOLO** cuando el usuario lo pida explícitamente (ej. *"Genera las traducciones"*).
- **Proceso**:
   1. Toma `es.mdx` como la ÚNICA fuente de verdad.
   2. Genera/Sobrescribe `en.mdx` y `ca.mdx`.
   - **Frontmatter**: Copia las propiedades genéricas (fechas, imágenes, tags, ids) tal cual.
   - **Textos**: Traduce `title` y `description`.
   - **Contenido**: Traduce el cuerpo del artículo manteniendo el formato MDX y componentes intactos.

## 5. Estructura de Archivos Esperada
```text
src/content/devlogs/[slug-proyecto]/[slug-capitulo]/
├── es.mdx  (MASTER: Aquí se edita todo)
├── en.mdx  (Generado automáticamente a petición)
└── ca.mdx  (Generado automáticamente a petición)
```

## 6. Scripts y Estructura del Proyecto

Cada capítulo que incluya código GDScript debe mantener:

1. **Carpeta `scripts/`**: Contiene los archivos `.gd` finales del capítulo.
   - Solo incluir archivos que se crean o modifican en ese capítulo.
   - El código debe coincidir EXACTAMENTE con los bloques "Script Completo" del MDX.

2. **Archivo `structure.md`**: Mapa de la estructura del proyecto Godot.
   - Tabla con cada archivo, su ruta en Godot y descripción.
   - Árbol de estructura completa del proyecto al finalizar el capítulo.
   - Estructura de nodos de las escenas si es relevante.

**Ejemplo de estructura de carpeta:**
```text
src/content/devlogs/game-dev-godot/part-X/
├── es.mdx
├── en.mdx
├── ca.mdx
├── _scripts/              ← Guion bajo para que Astro lo ignore
│   ├── player.gd
│   └── enemy.gd
└── _structure.md          ← Guion bajo para que Astro lo ignore
```

**Regla de Verificación**: Antes de finalizar un capítulo, verificar que TODOS los fragmentos de código del MDX coincidan con el script completo en la carpeta `scripts/`.

## 7. Uso del Componente Callout

Los Callouts son cajas destacadas para información secundaria. NO son para el temario principal.

**Uso Correcto (✅):**
- Curiosidades históricas o de la industria.
- Trampas comunes / Errores frecuentes (tipo "Cuidado").
- Tips de productividad o atajos.
- Links a recursos externos opcionales.
- Información "para curiosos" que no es esencial.

**Uso Incorrecto (❌):**
- Explicar conceptos fundamentales del temario (eso va en texto principal).
- Definiciones básicas que todo lector debe saber.
- Código obligatorio o explicaciones de sintaxis core.
