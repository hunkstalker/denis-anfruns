# UI Specification: Raycasting Engine (Wolfenstein 3D Style)

## Objetivo
Definir la interfaz de usuario para el engine de Raycasting en TypeScript. La estética debe replicar el estilo de los shooters de DOS de principios de los 90 (principalmente *Wolfenstein 3D*), priorizando la información clara y el feedback visceral.

## Estilo Visual (Aesthetic)
*   **Resolución Base**: 320x200 (VGA Mode 13h).
*   **Fonts**: "Status Bar Font" (Números grandes pixelados) y "Menu Font" (Gótica o militar).
*   **Colores**: Paleta VGA 256 colores (Azul oscuro para fondos de menú, Rojo sangre para salud).
*   **Layout**: Pantalla dividida. 80% Viewport 3D (Arriba), 20% Status Bar (Abajo, fija).

---

## 1. Mapa de Navegación (Flow)
```mermaid
graph TD
    A[DOS Prompt / Loading] --> B[Title Screen]
    B --> C[Main Menu]
    C --> D[Episode Select]
    D --> E[Difficulty Select]
    E --> F[In-Game]
    F --> G[Level Complete (Stats)]
    F --> H[Death Screen]
    F --> I[Pause Menu]
    I --> C
```

---

## 2. Detalle de Pantallas

### A. HUD (The Status Bar)
Barra gris inferior fija. Altura: 40px (en resolución 320x200).
Elementos de izquierda a derecha:
1.  **FLOOR**: Nivel actual (Ej: 1).
2.  **SCORE**: Puntuación (Ej: 000500).
3.  **LIVES**: Vidas restantes (Icono de cara + Número).
4.  **FACE (Centro)**: Retrato del protagonista.
    *   **Animación**: Ojos miran izq/der aleatoriamente.
    *   **Estado**: Cambia sprite según HP (100%, 75%, 50%, 25%, Muerto). Sangra progresivamente.
    *   **Feedback**: Mueca de dolor al recibir daño. Sonrisa malévola al coger arma nueva.
5.  **HEALTH**: Porcentaje (Ej: 100%). Fondo rojo si < 20%.
6.  **AMMO**: Munición (Ej: 99).
7.  **WEAPON**: Icono del arma equipada.

### B. Main Menu
*   **Estilo**: Fondo azul o imagen estática del castillo. Cursor es una bala o cuchillo.
*   **Opciones**:
    *   NEW GAME
    *   SOUND (ON/OFF)
    *   CONTROL (Mouse/Keyboard)
    *   READ THIS! (Instrucciones)
    *   QUIT TO DOS

### C. Difficulty Select (Imprescindible)
Al elegir New Game, mostrar caras representando la dificultad:
1.  **"Can I play, Daddy?"** (Fácil): Cara con chupete/bonete.
2.  **"Don't hurt me."** (Normal): Cara preocupada.
3.  **"Bring 'em on!"** (Difícil): Cara enfadada/determinada.
4.  **"I am Death incarnate!"** (Extremo): Ojos rojos brillantes.

### D. Pause Menu
*   Trigger: `ESC`.
*   Comportamiento: El juego se detiene completamente.
*   Diseño: Ventana pop-up con borde de ladrillo rojo.
*   Opciones: Resume, End Game, Back to Title.

### E. Debug Overlay (Herramienta Didáctica)
Se superpone al juego con tecla `TAB`.
*   **Top-Left**: Stats de Renderizado (`FPS`, `RayCount`, `SpriteCount`).
*   **Top-Right**: Mini-mapa 2D vectorial ("The World in Arrays").
    *   Muestra el Grid, la posición del jugador (punto) y el vector de dirección (línea).
    *   Muestra los rayos casteados en tiempo real (abanico amarillo).

---

## 3. Feedback FX
*   **Flash Rojo**: Al recibir daño, toda la pantalla parpadea en rojo (`rgba(255,0,0,0.5)`) un frame.
*   **Flash Amarillo/Blanco**: Al recoger items (Bonificación).
*   **Fizzle Fade**: Al morir o cambiar de nivel, usar el efecto de "derretido" (pixel dissolve) clásico de Wolf3D (opcional, pero recomendado por estilo).

## 4. Assets de UI Necesarios
*   `hud_bg.png`: La imagen de fondo de la barra de estado.
*   `face_spritesheet.png`: Matriz de caras (Estados de salud x Reacciones).
*   `font_numbers.png`: Sprites para los dígitos del HUD.
