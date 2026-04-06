# Devlog: SNES Mode 7 Racer (Web/TypeScript Edition)

## Objetivo del Proyecto
Crear un clon de *Super Mario Kart* utilizando tecnologías web nativas (HTML5 Canvas + TypeScript), pero **sin usar motores 3D (Three.js) ni WebGL directo**.
El reto es escribir un **Software Renderer** manual: manipularemos el array de píxeles (`Uint32Array`) directamente en la CPU para recrear el efecto Modo 7 auténtico, logrando ese look "crujiente" que Godot a veces suaviza demasiado.

## Tech Stack
*   **Lenguaje**: TypeScript (Strict Mode).
*   **Render**: HTML5 Canvas (`CanvasRenderingContext2D` y `ImageData`).
*   **Build Tool**: Vite.
*   **Multiplayer**: WebSockets (Cliente nativo + Servidor Node.js simple).

## Roadmap (Vertical Slice)

### Fase 1: El Motor de Software (The Retro PPU)
1.  **Buffer de Video**: Gestionar un array lineal `pixels[width * height]`.
2.  **Algoritmo Modo 7**:
    *   Implementar el bucle anidado `for (y) { for (x) { ... } }`.
    *   Calcular coordenadas de textura usando rotación y escala por scanline.
    *   Optimizaciones extremas (Math lookup tables) para mantener 60 FPS en JS.
3.  **Sprite Rasterizer**:
    *   Dibujar sprites escalados manualmente (Nearest Neighbor scaling) sobre el buffer.
    *   Implementar "Painter's Algorithm" (ordenar por Z) para la profundidad.

### Fase 2: Físicas & Gameplay
1.  **Arcade Physics**: Misma lógica vectorial que la versión Godot, pero implementada en una clase `PhysicsEngine` pura.
2.  **Main Loop**: Implementar un bucle de juego robusto con `requestAnimationFrame` y control de `deltaTime`.

### Fase 3: Multiplayer (WebSockets)
A diferencia de Godot, aquí "bajaremos al metal" de la red.
1.  **Backend (Node.js)**: Un servidor ligero que mantiene el estado autoritativo.
2.  **Protocolo Binario**: Enviar actualizaciones de posición usando `ArrayBuffer` para minimizar latencia (ideal didácticamente).
3.  **Predicción**: Implementar la reconciliación del cliente en JS puro.

## Estructura de Capítulos (Web Edition)

1.  **Part 1: The Virtual PPU**: Configurando el Canvas y el Buffer de Píxeles.
2.  **Part 2: Mode 7 Scanlines**: La matemática de proyección en CPU.
3.  **Part 3: Sprite Rasterization**: Dibujando sprites escalados a mano.
4.  **Part 4: Arcade Physics System**: Vectores y Derrapes en TS.
5.  **Part 5: The Game Loop**: Input, Update, Render cycle.
6.  **Part 6: WebSocket Server**: Creando un servidor autoritativo en Node.js.
7.  **Part 7: Network Interpolation**: Suavizando el lag en el navegador.
8.  **Part 8: Matchmaking & Polish**: UI en HTML/CSS y publicación.

## Estimación
Al ser "desde cero" (sin motor), es más intenso en código pero mucho más gratificante educativamente.
*   **Tiempo estimado**: 8 Capítulos densos.
