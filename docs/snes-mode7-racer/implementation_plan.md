# Devlog: SNES Mode 7 Racer (Mario Kart Clone)

## Objetivo del Proyecto
Crear un **Vertical Slice** (un nivel completo y jugable) de un juego de carreras arcade estilo *Super Mario Kart* o *F-Zero*.
El foco principal es recrear la **estética y tecnología** de la Super Nintendo (SNES), específicamente el famoso "Modo 7" (plano pseudo-3D rotable), utilizando técnicas modernas en Godot pero respetando las limitaciones visuales de la época.

## Tech Stack: "Modern Retro"
Utilizaremos Godot Engine, pero "limitado" artificialmente para lograr el look auténtico.

*   **Motor**: Godot 4.x.
*   **Lenguaje**: GDScript (Lógica de juego) y GLSL (Shaders visuales).
*   **Técnica de Renderizado (El "Truco")**:
    *   No usaremos cámaras 3D reales ni meshes de terreno.
    *   Usaremos un **Shader de Deformación de Perspectiva** sobre una textura plana (`ColorRect` o `TextureRect`).
    *   Fórmula mágica: `projection = 1.0 / (uv.y + horizon_offset)`. Esto simula el efecto de hardware HDMA de la SNES.
*   **Estética**:
    *   Resolución interna baja (ej. 256x224).
    *   Sin filtrado de texturas (`Nearest Neighbor`).
    *   Sprites pre-renderizados (billboards) para karts y objetos.

## Roadmap (Vertical Slice)

### Fase 1: El Motor Gráfico (La "SNES Virtual")
1.  **El Shader de Modo 7**:
    *   Implementar la transformación afín (rotación + escala) por scanline.
    *   Lograr el efecto de horizonte curvo e infinito.
2.  **Sprite Scaling**:
    *   Colocar objetos (árboles, monedas) en el mapa 2D.
    *   Calcular su posición en pantalla y escala base según la "distancia simulada" por el shader.

### Fase 2: Físicas de Karts (Arcade Handling)
No usaremos `VehicleBody3D` ni físicas realistas.
1.  **Top-Down Physics**:
    *   El coche es un `CharacterBody2D`.
    *   Modelo de derrape (Drift): Desacoplar el vector de velocidad del vector de rotación.
    *   Fricción y agarre variable (asfalto vs hierba).
2.  **La Cámara de Seguimiento**:
    *   La cámara no "se mueve", es el mundo el que rota alrededor del coche (conceptualmente, aunque en Godot moveremos la cámara lógica).
    *   Efecto de "bank/tilt" al girar para dar dinamismo.

### Fase 3: Gameplay Loop (El Juego)
1.  **Circuito**: Diseñar una pista con curvas, rectas y obstáculos usando un Tilemap o Textura gigante.
2.  **IA Rival**: Implementar 1 o 2 karts rivales con pathfinding básico (seguir waypoints).
3.  **UI/HUD Retro**:
    *   Contador de vueltas, posición y mapa del circuito.

### Fase 4: Multiplayer Online (Ingeniería de Redes)
El broche de oro teconológico. Implementaremos un modelo **Cliente-Servidor Autoritativo** usando `MultiplayerSynchronizer` de Godot.
1.  **Arquitectura Autoritativa**:
    *   "El Cliente Miente": Los clientes solo envían inputs (acelerar, girar).
    *   El Servidor simula la física y devuelve la posición real.
2.  **Ocultación de Latencia**:
    *   **Predicción de Cliente**: Mover el coche local instantáneamente y corregir suavemente (Reconciliación) si el servidor discrepa.
    *   **Interpolación de Entidades**: Renderizar a los rivales en el pasado (con buffer de ~100ms) para movimiento ultra-suave.
3.  **Lobby Simple**: Unirse a partida por IP.

## Assets Necesarios (Placeholder o Final)
*   **Textura de Suelo**: 1024x1024 (Mapa del circuito).
*   **Sprites de Kart**: Hoja de sprites con 8 o 16 direcciones de rotación.
*   **Props**: Árboles, tuberías, bloques sorpresa.

## Estimación
Este proyecto es técnico pero muy visual.
*   **Single Player**: 4-5 Capítulos.
*   **Multiplayer**: +3 Capítulos (Conceptos de Red + Implementación).
*   **Total**: ~8 Capítulos para un juego de carreras online completo.
