---
title: 'StarDraw ✨'
description: 'Inicio del desarrollo de StarDraw, un proyecto para dominar React y crear mi primer proyecto público.'
pubDate: '2025-11-22 20:28'
# updatedDate: '2025-12-07 19:00'
tags: ['react', 'konva', 'zustand', 'stardraw', 'excalidraw']
series: 'StarDraw'
heroImage: '/assets/stardraw/hero-stardraw.png'
---

## StarDraw: Inicio del proyecto

El objetivo principal de este proyecto es aprender a crear una aplicación desde cero utilizando tecnologías modernas. La idea nació de la curiosidad de dominar tecnologías como <span class='text-[--tangerine]'>React</span> y <span class='text-[--tangerine]'>TypeScript</span>, necesitaba un proyecto que me requiriera el uso de componentes ya que hasta el momento a nivel profesional sólo he trabajado con <span class='text-[--tangerine]'>Power Apps</span>, en la solución errores en estilos de proyectos ya en producción y en mi propio sitio desarrollado en <span class='text-[--tangerine]'>Astro</span>. Finalmente necesito rellenar mi portfolio con algún proyecto así que si este proyecto tiene éxito podría ser el primero.

No busco sólo clonar funcionalidades, sino <span class='text-[--tangerine]'>entender el "por qué" detrás de cada decisión técnica</span>, cómo funciona y aportar algunas ideas que hagan mi herramienta más útil que la original.

Para estas cosas he empezado a usar <span class='text-[--tangerine]'>Gemini 3</span> para que me recomiende tecnologías y patrones de diseño pidiéndole la respectiva documentación y ejemplos con enlaces para consultar las fuentes. Por ejemplo, me recomendó <span class='text-[--tangerine]'>Zustand</span> para el manejo de estado global, tecnologia que sabía de su existencia pero que no había probado. También me recomendó <span class='text-[--tangerine]'>React Konva</span> para el manejo del canvas, tecnologia que en este caso no tenía ni idea de su existencia, pero he visto que me solucionará la creación de la mayoría de las herramientas que necesito para el proyecto.

### La idea

Mientras aprendo, la idea es construir un clon de Excalidraw pero personalizado a mi gusto, tanto en diseño como en funcionalidades, con algunos extras dado que echo en falta cosas en la herramienta original.

- Mejor control de los colores en modo oscuro.
- Guardar/exportar directamente una imagen PNG/JPG de cualquier elemento seleccionado del canvas.
- Ajuste de cuadrícula para los elementos.
- Más opciones de tipografía para los textos.
- Mejor gestión de tamaños de texto.
- Mejor gestión de colores de texto.
- Soporte para diagramas tipo de nodos o bases de datos.

Partes importantes que quiero mantener son la <span class='text-[--tangerine]'>filosofía "local first"</span> y la posibilidad de exportar los proyectos en un formato que más tarde se pueda cargar y continuar editando.

### Stack Tecnológico

#### 1. React 19 + Vite + TypeScript
No he trabajado mucho en proyectos desde cero con React, pero por todo lo que tengo leído hasta ahora sé que es una tecnología madura y por eso la he elegido, además de que tengo la necesidad de aprenderlo junto a TypeScript.
Tengo que añadir que soy un forofo del rendimiento y creo que alternativas como <span class='text-[--tangerine]'>Svelte</span> o <span class='text-[--tangerine]'>Solid</span> serían mejores en ese sentido. Pero al no ser tecnologías con tanto recorrido y que tienen carencias respecto a la cantidad de bibliotecas que hay disponibles, me ha parecido sensato empezar con React.

#### 2. Konva (React Konva)
Aquí me dejé guiar mucho por Gemini 3, que me recomendó usar <span class='text-[--tangerine]'>Konva</span> para el manejo del Canvas. Según me dijo, "trabajar directamente con la API de Canvas del navegador es verboso y complejo de mantener. Konva nos ofrece una abstracción orientada a objetos (capas, grupos, formas) y `react-konva` nos permite manejarlo de forma declarativa, integrándose perfectamente con el ciclo de vida de React."

Bueno, me voy a fiar. Igualmente en algún momento quiero meter las zarpas en Canvas aunque sea para alguna pequeña tontería. Quiero conocer las diferencias entre lo que ofrece Canvas o una biblioteca como Konva.

#### 3. Zustand
Esto lo tuve bastante claro. Es una biblioteca ligera y muy utilizada para los estados globales. No es la única opción, pero me parece que es una de las más simples y fáciles de usar.

#### 4. Herramientas Auxiliares
Más recomendaciones de Gemini 3.
- **<span class='text-[--tangerine]'>SortableJS</span>**: Para permitir reordenar capas o elementos de la UI fácilmente con D&D (Dungeons & Dragons no, Drag & Drop).
- **<span class='text-[--tangerine]'>Tailwind CSS</span>**: Una recomendación un poco innecesaria, ya tenía pensado utilizarla. Por ahora en este proyecto mi objetivo no es dominar CSS. Por otro lado además creo que se ha impuesto a **Bootstrap** el cual ya me harté de usarlo en mis años de estudio.

### Primeros pasos del desarrollo

Empecé el proyecto creando la base para `react-konva` y la interfaz principal de panel de herramientas. Para los iconos utilicé <span class='text-[--tangerine]'>lucide-react</span>. Nada del otro mundo por ahora, sólo unos pocos elementos Button y estilos con Tailwind. Lo segundo que quise abordar es el modo oscuro por comodidad visual para trabajar en el proyecto, por lo que también añadí un botón para cambiar el tema.

Ignorad el slide y el fondo de puntos, esta captura y la de la cabecera es de la versión en el momento de escribir este artículo, así que ya os he hecho un poco de spoiler 😁

![image](/assets/stardraw/panel-herramientas.png)

Nada más empezar lo que más me impresionó al inicio es todo lo que cubre `react-konva`. Facilita mucho el desarrollo de las herramientas que necesito para el proyecto.

Así que ya tenía la estructura de carpetas definida, dependencias instaladas y un canvas con un panel de herramientas en el que había un botón funcional que cambiaba entre el modo claro y oscuro. Paso a paso.
