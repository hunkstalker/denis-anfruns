---
description: Guía paso a paso para crear una nueva parte de una serie de aprendizaje TIL
---

# Cómo se crea una serie de aprendizaje TIL

En este workflow se detalla cómo añadir una nueva parte a las series de aprendizaje (como la de TypeScript Basics). El objetivo es documentar el proceso para asegurar que cualquier persona pueda seguir los pasos.

## 1. Preparación del terreno

Primero, se debe localizar dónde residen las series. Todo se encuentra en `src/content/til/`. Si la serie ya existe (ej. `typescript-basics`), se accede a ella. Si es nueva, se crea la carpeta con un `slug` descriptivo.

Dentro de la carpeta de la serie, se crea una nueva subcarpeta para el capítulo, siguiendo el patrón `part-N` (ej. `part-4`).

```bash
mkdir src/content/til/mi-serie/part-N
```

## 2. Definición de los metadatos

El sistema necesita identificar el contenido. Para ello, se crea un archivo `meta.json` dentro de la nueva carpeta. Aquí se definen el título, la descripción y las etiquetas. Es importante mantener la consistencia con los capítulos anteriores.

```json
{
	"seriesTitle": {
		"es": "Título de la Serie",
		"en": "Series Title",
		"ca": "Títol de la Sèrie"
	},
	"seriesDescription": {
		"es": "Descripción corta de lo que va la serie.",
		"en": "Short description of the series.",
		"ca": "Descripció curta de la sèrie."
	},
	"tags": ["tag1", "tag2"],
	"pubDate": "2024-01-01T10:00:00Z",
	"draft": true
}
```

> **Nota:** Se utiliza `draft: true` durante el desarrollo para evitar su publicación accidental.

> **Nota:** Se utiliza `draft: true` durante el desarrollo para evitar su publicación accidental.

## 3. Guía de Estilo y Tono

Es crucial mantener la coherencia en la voz de la serie. Se deben seguir estas reglas:

1.  **Introducción y Contexto (Meta)**: Se usa la **tercera persona del singular / impersonal** (ej. "Se pretende...", "El objetivo es..."). Esto separa la intención pedagógica del contenido en sí.
    *   *Correcto*: "En esta serie se intenta explicar..."
    *   *Incorrecto*: "En esta serie intento explicar..."

2.  **Contenido de la Guía (El aprendizaje)**: Se usa la **primera persona del plural ("Nosotros")** para acompañar al lector (ej. "Aprendemos", "Vemos", "Hacemos").
    *   *Correcto*: "Ahora vamos a definir un tipo..."
    *   *Incorrecto*: "Ahora vas a definir un tipo..."

3.  **La Herramienta (TypeScript)**: Se debe tratar a TypeScript/TS como un **sujeto activo** (ej. "TS infiere", "El compilador avisa"). Evitamos que el usuario sea quien "hace el trabajo" de inferir. "Dejamos que TS trabaje por nosotros".
    *   *Correcto*: "TS infiere el tipo...", "Dejamos que TS deduzca..."
    *   *Incorrecto*: "Dejas que él adivine..."

## 4. Redacción del contenido (MDX)

Se crean los archivos de contenido para cada idioma: `es.mdx`, `en.mdx` y `ca.mdx`.
La estructura básica del Frontmatter es:

```mdx
---
title: 'TypeScript #4: Arrays y Tuplas'
description: 'Aprendemos a manejar colecciones de datos.'
lang: 'es'
---
```

## 5. Creación de la Experiencia Interactiva (TSEditor)

Para fomentar el aprendizaje práctico, se utiliza el componente `TSEditor`.

### Configuración Estándar

Para ejemplos simples donde solo se quiere mostrar código y autocompletado:

```tsx
import TSEditor from '../../../../components/learn/TSEditor.tsx';

<TSEditor
  client:only="react"
  height="300px"
  showConsole={true}      // Si se usa console.log
  allowAddFile={false}    // Simplifica la UI, sin pestañas extra
  files={{
    'demo.ts': `console.log("Hola mundo");`
  }}
/>
```

### Configuración con Ejercicio y Validación (Gamificación)

Si se desea retar al usuario a resolver un problema y darle feedback:

1.  **Creación de la lógica de validación**:
    En la misma carpeta `part-N`, se crea un archivo `validation.ts`.
    
    ```typescript
    // validation.ts
    declare const onSuccess: () => void;
    // Se declaran las variables que se espera que el usuario defina
    declare const miVariable: string; 

    // Lógica de comprobación
    try {
        if (typeof miVariable === 'undefined') throw new Error("¡Falta definir miVariable!");
        if (miVariable !== "valor correcto") throw new Error("El valor no es correcto");

        console.log("✅ ¡Correcto! Buen trabajo. 🏆");
        onSuccess(); // Dispara confeti y sonido
    } catch(e: any) {
        console.error("❌ " + e.message);
    }
    
    export {};
    ```

2.  **Conexión de la validación en el MDX**:

    ```tsx
    import validationCode from './validation.ts?raw'; // Se importa como raw text

    <Callout type="party" title="¡Tu turno!">
        <p>Define <code>miVariable</code> con el valor correcto y dale a Run.</p>
    </Callout>

    <TSEditor
      client:only="react"
      showConsole={true}
      validationCode={validationCode}
      successSound="/audio/grunt-birthday-party-sound.mp3"
      files={{
        'main.ts': `// Escribe tu código aquí...`
      }}
    />
    ```

## 6. Revisión y Publicación

Una vez el contenido y los ejercicios funcionan:
1.  Se verifica que el playground funciona correctamente (`pnpm dev`).
2.  Se elimina `draft: true` del `meta.json`.
3.  Se da por finalizada la creación del nuevo contenido. 🚀
