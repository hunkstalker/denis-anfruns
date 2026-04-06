# Part 5: Game Loop & Polish (Cerrando el Círculo)

## Objetivo Didáctico
Un motor físico y una IA no son un juego. Un juego tiene principio, nudo y desenlace.
Implementaremos el flujo completo de la partida, la interfaz de usuario (HUD) y esos pequeños detalles de "Juice" que diferencian una demo técnica de un producto acabado.

**Meta Final del Capítulo**: Una pantalla de título, cuenta atrás (3, 2, 1, YA!), carrera a 3 vueltas, detección de ganador y vuelta al menú.

---

## 1. El Game Manager
Un Singleton (`Autoload`) que orquesta el estado global.
*   `enum GameState { MENÚ, CUENTA_ATRAS, CARRERA, RESULTADOS }`
*   Variables: `current_lap`, `max_laps = 3`, `player_place` (posición 1st/2nd).

### El Semáforo (Start Sequence)
Sincronizar música y lógica.
1.  Instanciar Karts pero con `input_enabled = false`.
2.  Animación Timer: 3... (Sonido Low), 2... (Sonido Low), 1... (Sonido Low).
3.  **GO!** (Sonido High):
    *   `input_enabled = true`.
    *   `start_race_timer()`.
    *   Reproducir música del circuito.

## 2. UI & HUD (Retro Style)

### Capa de Rendering (CanvasLayer)
La UI debe pintarse **encima** del shader de Modo 7.
Godot lo hace fácil. Nodos `Control` dentro de un `CanvasLayer`.

### Elementos Vitales
1.  **Contador de Vueltas**: `Lap 1/3`.
2.  **Tiempo**: Formato `MM:SS:mm` (minutos, segundos, milisegundos).
3.  **Posición**: Lógica de ranking.
    *   ¿Cómo calcular quién va primero?
    *   Uso de los Checkpoints: `Score = (vueltas_completadas * 1000) + (checkpoint_idx * 10) + distancia_al_siguiente_checkpoint`. Comparar scores cada frame para ordenar la UI.

### El Minimapa (Esencial en Mode 7)
Como la vista es confusa (suelo plano), el jugador necesita orientación.
*   **Técnica**:
    *   No usar una segunda cámara (muy costoso renderizar todo 2 veces).
    *   Usar simplemente iconos 2D (`Sprite2D`) sobre una imagen estática del mapa.
    *   Actualizar posiciones: `minimap_icon.position = player.world_position * minimap_scale_factor`.

## 3. Polish & Juice (Sensaciones)

### Screen Shake
Cuando chocas contra un muro o caes al vacío (si hay agujeros).
*   En este engine es facilísimo: Modificar el `camera_offset` del Shader aleatoriamente durante 0.5s.
*   `uniform vec2 camera_shake`.

### Transiciones (Wipe)
Al terminar la carrera, no cortar de golpe.
*   Efecto de "Iris Out" (círculo negro cerrándose) o "Mosaico" (pixelación progresiva hasta negro) usando otro shader en post-proceso simple.

## 4. Tarea para el Lector
*   Conectar el `RaceManager` con los `Karts`.
*   Diseñar la HUD con una fuente pixelada (ej. estilo Super Mario World).
*   Implementar la lógica de "Ganar/Perder".
