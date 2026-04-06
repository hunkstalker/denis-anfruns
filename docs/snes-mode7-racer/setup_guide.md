# Setup Guide: SNES Mode 7 Racer (Godot 4.x)

## 1. Project Settings (Configuración del Motor)
Estos ajustes son **obligatorios** para lograr la estética SNES y el funcionamiento correcto de la física arcade.

### Display & Window
*   **Viewport Width**: `320`
*   **Viewport Height**: `224` (Resolución nativa SNES NTSC)
*   **Myde**: `Viewport` (Para escalar los píxeles sin suavizar).
*   **Aspect**: `Keep` (Mantener 4:3 con bandas negras si es necesario).
*   **Window Override**: `1280` x `896` (Escala x4 por defecto al abrir).

### Rendering (Look Retro)
*   **Textures -> Canvas Textures -> Default Texture Filter**: `Nearest` (CRÍTICO: Si no, se verá borroso).
*   **2D -> Snap 2D Transforms to Pixel**: `On` (Evita "jitter" en sprites en movimiento lento).

### Physics 2D
*   **Gravity**: `0` (Es un juego Top-Down, no de plataformas).

## 2. Input Map (Mapa de Entradas)
Configurar en `Project -> Project Settings -> Input Map`.

| Acción | Tecla Primaria | Tecla Secundaria | Gamepad |
| :--- | :--- | :--- | :--- |
| `p1_accelerate` | `W` | `Up Arrow` | `Xbox A / PS Cross` |
| `p1_brake` | `S` | `Down Arrow` | `Xbox B / PS Circle` |
| `p1_left` | `A` | `Left Arrow` | `D-Pad Left / Stick Left` |
| `p1_right` | `D` | `Right Arrow` | `D-Pad Right / Stick Right` |
| `p1_drift` | `Space` | `Shift` | `R-Shoulder / R-Trigger` |
| `ui_pause` | `Esc` | `P` | `Start / Options` |

## 3. Capas de Colisión (Layers)
Usaremos el sistema de física para lógica de juego, no solo choque.

*   **Layer 1 (World)**: Muros invisibles (límites de la pista).
*   **Layer 2 (Offroad)**: Césped, arena (áreas que frenan).
*   **Layer 3 (Kart)**: Los coches.
*   **Layer 4 (Items)**: Monedas, turbos.

## 4. Estructura de Escenas (.tscn)
*   `res://scenes/Core/GameManager.tscn` (Autoload).
*   `res://scenes/Karts/KartBase.tscn` (CharacterBody2D + Sprite + Shadow).
*   `res://scenes/Tracks/Track_DonutPlains.tscn` (TextureRect con Shader + StaticBody2D colisiones).
*   `res://ui/HUD.tscn` (CanvasLayer).

## 5. Shaders
Todo el código de shader debe ir en `res://shaders/`.
*   `mode7_ground.gdshader`: El shader principal del suelo.
