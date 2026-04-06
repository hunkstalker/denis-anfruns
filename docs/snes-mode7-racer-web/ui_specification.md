# UI Specification: SNES Mode 7 Racer (Web)

## Enfoque "Hybrid"
A diferencia de la versión Godot o Raycasting, aquí **no pintaremos la UI en el Canvas**.
Usaremos **HTML/CSS** superpuesto. Esto es más accesible, nítido y fácil de animar.

## 1. Structure (DOM)
```html
<main id="app">
    <!-- Capa 0: El Juego -->
    <canvas id="game-canvas"></canvas>
    
    <!-- Capa 1: Scanlines (Overlay decorativo) -->
    <div id="scanlines"></div>

    <!-- Capa 2: HUD (Visible en carrera) -->
    <div id="hud" class="hidden">
        <div class="hud-top">
            <div class="score-box">
                <span class="label">LAP</span>
                <span class="value" id="lap-display">1/3</span>
            </div>
            <div class="score-box">
                <span class="label">TIME</span>
                <span class="value" id="time-display">00:00:00</span>
            </div>
        </div>
    </div>

    <!-- Capa 3: Menús (Visible fuera de carrera) -->
    <div id="menus">
        <!-- Main Menu -->
        <div id="menu-main" class="panel">
            <h1>SUPER WEB RACER</h1>
            <button data-action="single">SOLO RACE</button>
            <button data-action="multi">ONLINE</button>
        </div>
        
        <!-- Lobby -->
        <div id="menu-lobby" class="panel hidden">
            <h2>ONLINE LOBBY</h2>
            <div id="player-list"></div>
            <button id="btn-ready">I'M READY</button>
        </div>
    </div>
</main>
```

## 2. Estilo (CSS)
*   **Fuente**: Importar una Google Font pixelada (ej. 'Press Start 2P').
*   **Colores**: Gradientes CSS en los botones (`linear-gradient(to bottom, #f0f, #a0a)`).
*   **Animaciones**: Usar `transition: transform 0.1s` para que los botones "boten" al pulsarlos.
