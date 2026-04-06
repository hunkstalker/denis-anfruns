# Part 1: El Mundo en Arrays (2D)

## Objetivo Didáctico
Crear la simulación lógica del mundo antes de visualizarla. Definiremos el mapa (Grid), el jugador (Vector) y las reglas físicas básicas. El resultado será un juego 2D funcional visto "desde arriba" (Top-Down) pintado en nuestra Virtual VGA.

**Meta Final del Capítulo**: Mover un punto por un laberinto 2D con colisiones deslizantes (wall sliding).

---

## 1. Especificación Técnica

### Estructura del Mapa (`GridMap`)
*   **Representación**: Array plano 1D para mejor caché + funciones helper de acceso 2D.
*   **Contenido**: Enteros. `0` = Aire. `>0` = ID de textura/color de muro.
*   **Clase `Level`**:
    ```typescript
    class Level {
      width: number;
      height: number;
      walls: Uint8Array; // Array optimizado de bytes

      getWall(x: number, y: number): number {
        // Validación de límites (Bound check) para evitar crashes
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 1; // Muro invisible fuera del mapa
        return this.walls[y * this.width + x];
      }
    }
    ```

### Matemáticas Vectoriales (Sin Dependencias)
Implementaremos solo lo necesario. Evitar overhead de creación de objetos `new Vector2()` en cada frame.
*   **Estado del Jugador**:
    ```typescript
    class Player {
      x: number;      // Posición mundo (enteros = casillas, decimales = posición interna)
      y: number;
      dirX: number;   // Vector dirección normalizado
      dirY: number;
      planeX: number; // Vector plano de cámara (perpendicular a dir)
      planeY: number; 
      speed: number = 5.0; // Unidades/segundo
      rotSpeed: number = 3.0; // Radianes/segundo
    }
    ```
*   **Matrices de Rotación**:
    Recordatorio de fórmulas fundamentales:
    *   `newX = x * cos(r) - y * sin(r)`
    *   `newY = x * sin(r) + y * cos(r)`

### Input System
No usar `addEventListener` directo en el update.
*   **InputState**: Objeto/Mapa booleano `keys = { w: false, a: false... }`.
*   Eventos `keydown`/`keyup` solo actualizan el estado.
*   El `update()` lee el estado.

### Física de Movimiento (Slide Collision)
No queremos que el jugador se quede pegado ("sticky walls").
*   **Algoritmo de Pasos Separados**:
    1. Calcular nueva posición deseada solo en eje X: `nextX`.
    2. Chequear colisión en `(floor(nextX), floor(y))`.
    3. Si libre -> `x = nextX`.
    4. Repetir independientemente para eje Y con `nextY`.
*   Esto permite deslizarse por la pared al chocar en diagonal.

---

## 2. Contenido Educativo

### Sección 1: El Mapa en Memoria
*   Visualizar cómo un array `[1,1,1,1,0,1...]` se convierte en un laberinto.
*   Por qué usamos `floor()` para detectar en qué casilla de mapa estamos.

### Sección 2: Vectores y Trigonometría Básica
*   **Explicación Visual**: Círculo unitario.
*   Si `dir` es `(1, 0)` (Mirando derecha, este), ángulo 0.
*   Si rotamos 90 grados: `cos(90)=0`, `sin(90)=1`. Nuevo dir `(0, 1)`.
*   **Plane Vector**: Qué es y por qué controla el FOV. (Relación entre longitud de plane y FOV: `len(plane) = tan(FOV/2)`).

### Sección 3: Debug Rendering (MiniMap)
Para verificar que todo funciona, dibujaremos el mundo en 2D.
*   Cada celda del mapa es un cuadrado de `cellSize` píxeles.
*   Dibujar cuadrado blanco en `(floor(player.x)*s, floor(player.y)*s)`.
*   Dibujar línea de dirección: `drawLine(px, py, px + dirX*10, py + dirY*10)`. (Requiere implementar algoritmo de Bresenham básico si queremos líneas, o pintar píxeles a lo bruto).

## 3. Tarea para el Lector
*   Implementar `Level` y `Player`.
*   Mapear teclas WSAD.
*   Lograr mover el punto por el mapa sin que atraviese paredes.
