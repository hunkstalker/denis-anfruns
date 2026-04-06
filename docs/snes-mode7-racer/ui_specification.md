# UI Specification: SNES Mode 7 Racer

## Objetivo
Definir exhaustivamente todos los menús y elementos de interfaz (HUD) necesarios para el Vertical Slice. Este documento sirve de guía para implementar la navegación y el feedback visual del juego.

## Estilo Visual (Aesthetic)
*   **Resolución Base**: 320x240 (escalado a pantalla completa).
*   **Fuentes**: Pixel-art gruesa (tipo *Super Mario World* o *F-Zero*). Borde negro, interior blanco/gradiente.
*   **Colores**: Paleta saturada (Cian, Magenta, Amarillo).
*   **Feedback**: Sonidos "Crunchy" al navegar (bip) y confirmar (ding).

---

## 1. Mapa de Navegación (Flow)
```mermaid
graph TD
    A[Splash Screen] --> B[Title Screen]
    B --> C[Main Menu]
    C --> D[Single Player Setup]
    C --> E[Multiplayer Lobby]
    C --> F[Options]
    D --> G[Game Scene (Race)]
    E --> G
    G --> H[Pause Menu]
    G --> I[Results Screen]
    H --> C
    I --> C
```

---

## 2. Detalle de Pantallas

### A. Title Screen
*   **Fondo**: Escena del juego corriendo sola (Attract Mode) o Arte estático.
*   **Elementos**:
    *   Logo Gigante: "SUPER MODE 7 RACER".
    *   Texto parpadeante: "PRESS START" (o Enter/Space).
*   **Acción**: Al pulsar cualquier tecla -> Ir a Main Menu.

### B. Main Menu
*   **Layout**: Lista vertical centrada.
*   **Opciones**:
    1.  **SOLO RACE**: Jugar contra la IA.
    2.  **ONLINE MULTIPLAYER**: Ir al Lobby.
    3.  **OPTIONS**: Volumen, Pantalla, Controles.
    4.  **QUIT**: Salir al escritorio.

### C. Multiplayer Lobby (La Pieza Clave)
*   **Layout**: División en dos columnas.
*   **Columna Izquierda (Setup)**:
    *   Input `Player Name`: Campo de texto (Max 8 chars).
    *   Input `Host IP`: Campo de texto (Default: 127.0.0.1).
    *   Botones: [HOST GAME], [JOIN GAME].
*   **Columna Derecha (Player List)**:
    *   Panel de lista de jugadores conectados.
    *   Cada fila: `[Avatar] Nombre - STATUS`.
    *   Status: "Ready" (Verde) o "Waiting" (Rojo).
*   **Pie de Página**:
    *   Botón [START RACE] (Solo visible para el Host, habilitado cuando todos están Ready).
    *   Texto de estado: "Connecting...", "Failed to join", "Tú eres el Host".

### D. HUD (In-Game Overlay)
Debe ser mínimalista para no tapar la pista, pero legible.
*   **Top-Left**:
    *   `POS`: 1st / 8th (Numero grande).
    *   `LAP`: 1/3.
*   **Top-Right**:
    *   `TIME`: 00:00:00 (Minutos:Segundos:Centesimas).
    *   `BEST`: 00:00:00 (Mejor vuelta).
*   **Bottom-Right (Minimapa)**:
    *   Cuadrado semitransparente con el trazado del circuito (línea blanca).
    *   Puntos brillaantes para los Karts (Jugador = Verde, Enemigos = Rojo).
*   **Centro Pantalla (Alertas)**:
    *   "3, 2, 1, GO!" (Animación inicial).
    *   "FINAL LAP!" (Cuando empieza la vuelta 3).
    *   "WRONG WAY" (Si el jugador va en dirección contraria > 2 seg).

### E. Pause Menu
*   **Trigger**: Tecla ESC / Start.
*   **Comportamiento**:
    *   **Solo**: Congela el juego (`get_tree().paused = true`).
    *   **Multiplayer**: **NO** congela el juego. Muestra el menú sobre la carrera en tiempo real.
*   **Opciones**:
    *   RESUME
    *   RESTART (Solo en Single Player).
    *   QUIT TO TITLE.

### F. Results Screen
*   **Trigger**: Al cruzar la meta en la última vuelta.
*   **Contenido**:
    *   Título: "FINISHED!" (o "WINNER" si 1st).
    *   Tabla de Clasificación:
        1.  Nombre - Tiempo Total
        2.  Nombre - Tiempo Total (+Diff)
        ...
    *   Botón [RETRY] (Reinicia carrera).
    *   Botón [MENU] (Vuelve al Título).

---

## 3. Assets de UI Necesarios
*   `font_retro_bold.ttf`
*   `panel_border.9patch` (Textura para bordes de ventanas estilo SNES).
*   `cursor_hand.png` (Icono para seleccionar opciones).
*   `icon_player_ready.png` / `icon_player_wait.png`.
