# Devlog: Raycasting Engine (Wolfenstein 3D Clone)

## Objetivo Didáctico
El propósito de este devlog es **desmitificar los gráficos 3D**.
En lugar de utilizar motores modernos o APIs de alto nivel (Three.js, WebGL) que ocultan las matemáticas, construiremos un motor de renderizado tipo *Wolfenstein 3D* desde cero, píxel a píxel.

El objetivo final es que el lector entienda la trigonometría, álgebra vectorial y algoritmos de optimización que hacen posibles los videojuegos 3D "bajo el capó".

## Tech Stack: "The Virtual VGA"
Para mantener el foco en las matemáticas y algoritmos sin distracciones de setup complejos (C++/WASM), utilizaremos tecnologías web puras pero con un enfoque "retro":

*   **Lenguaje**: TypeScript (Tipado estricto para estructuras de datos claras).
*   **Rendering**: HTML5 Canvas (`CanvasRenderingContext2D`), pero utilizado **solo** como volcado de framebuffer.
*   **Virtual VGA**:
    *   No usaremos funciones de dibujo de alto nivel (`lineTo`, `fillRect`).
    *   Simularemos un buffer de memoria (`ImageData` / `Uint32Array`).
    *   Implementaremos nuestra propia función `putPixel(x, y, color)`.

Esto permite ejecutar los ejemplos **directamente en el navegador/editor de la web** y ver los resultados al instante.

## Roadmap / Syllabus

### Episodio 0: La Máquina Virtual
Configuración del entorno y creación de nuestro "monitor" virtual.
*   Setup del proyecto TS.
*   El Loop principal: `requestAnimationFrame` y `delta_time`.
*   Abstracción del Canvas: Implementación de un buffer de píxeles manual.
*   **Concepto clave**: Cómo se representan las imágenes en memoria (arrays 1D vs coordenadas 2D).

### Episodio 1: El Mundo en Arrays (2D)
Antes de las 3D, necesitamos un mundo lógico.
*   Estructuras de datos básicas: Grid Map (Arrays 2D de enteros).
*   El Jugador: Posición (x, y) y Orientación (ángulo).
*   Matemáticas vectoriales "caseras": Suma, resta y normalización sin librerías externas.
*   Movimiento básico y colisiones contra la rejilla.

### Episodio 2: Los Ojos del Jugador (Teoría de Raycasting)
El corazón del sistema. Cómo vemos el mundo.
*   Concepto de FOV (Campo de Visión) y Plano de Proyección.
*   **El Algoritmo DDA (Digital Differential Analyzer)**:
    *   Por qué avanzar píxel a píxel es lento e impreciso.
    *   Cómo saltar matemáticamente de "línea de grid" en "línea de grid".
    *   Cálculo de intersecciones con trigonomtría básica.

### Episodio 3: Alzando Muros (Proyección)
Convirtiendo distancias 2D en columnas verticales.
*   Corrección de Ojo de Pez (Fisheye): `distancia * cos(angulo_relativo)`.
*   Proyección en perspectiva: `altura_muro = constante / distancia`.
*   Renderizado de columnas verticales color sólido.
*   Implementación de sombreado básico basado en distancia (niebla lineal).

### Episodio 4: Texturizado (El Reto Matemático)
Añadiendo detalle y realismo.
*   Cálculo de la coordenada U (horizontal) de la textura en el impacto.
*   Mapeo vertical: Interpolación de la coordenada V a lo largo de la columna de pantalla.
*   Optimización de acceso a texturas en memoria.

### Episodio 5: Sprites y Entidades
Objetos dentro del laberinto.
*   **Billboarding**: Cómo hacer que un plano 2D mire siempre a la cámara.
*   Proyección y escalado de sprites (similar a los muros pero con posición libre).
*   **Z-Buffer (Depth Buffer)** simplificado: Ordenar el dibujado para que los objetos no se vean a través de las paredes (o pintar de atrás hacia adelante).

## Fase 2: Vertical Slice & Doom-Level Raycasting (Futuro)
Una vez completados los 5 capítulos fundamentales (el Motor Gráfico base), el plan es evolucionar el proyecto hacia:

1.  **Gameplay Vertical Slice**:
    *   Transformar el "Walking Simulator" en un juego real.
    *   Sistema de armas, enemigos con IA básica, puertas y llaves.
2.  **Raycasting Avanzado (Nivel Doom)**:
    *   **Floor & Ceiling Casting**: Texturizado de suelos y techos (ya no serán colores planos).
    *   **Sectores y Alturas Variables**: Superar la limitación de muros de altura uniforme.
    *   **Iluminación Dinámica**: Sombreado por distancia y fuentes de luz.

## Estimación de Esfuerzo (Roadmap Completo)
Para completar el **Vertical Slice** (Motor + Juego + Boss):

*   **Fase 1 (Motor Gráfico)**: Capítulos 0 a 5.
    *   *Complejidad*: Alta (Matemáticas intensas).
    *   *Tiempo estimado*: 6-8 Sesiones de desarrollo.
*   **Fase 2 (Gameplay & Boss)**: Capítulos 6 a 9 (aprox).
    *   *Complejidad*: Media (Lógica de juego, IA).
    *   *Tiempo estimado*: 4-6 Sesiones de desarrollo.

**Total**: Unas **12-14 entregas/capítulos** del devlog para ir desde "Pantalla en Negro" hasta "Matar al Boss y Créditos".
