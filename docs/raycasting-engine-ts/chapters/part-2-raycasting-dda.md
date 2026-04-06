# Part 2: Los Ojos del Jugador (Teoría de Raycasting & DDA)

## Objetivo Didáctico
Implementar el núcleo matemático. Convertiremos el mapa 2D en datos de percepción 3D. El estudiante entenderá por qué Wolfenstein 3D fue revolucionario: no calculaba 3D real, sino que usaba un truco de barrido (Raycasting) extremadamente eficiente.

**Meta Final del Capítulo**: Visualizar en el minimapa 2D un "abanico" de rayos que salen del jugador y se detienen exactamente al tocar las paredes.

---

## 1. Especificación Técnica

### Configuración del Rayo (Setup)
Iteramos por cada columna vertical de la pantalla `x` (de 0 a `screenWidth`).

1.  **Espacio de Cámara Normalizado**:
    Convertir píxel `x` a rango `[-1, 1]`.
    *   `cameraX = (2 * x / width) - 1`
    *   `x=0 -> -1` (Izquierda FOV), `x=middle -> 0` (Centro), `x=width -> 1` (Derecha FOV).

2.  **Dirección del Rayo**:
    Suma vectorial de la dirección del jugador + el plano de cámara escalado.
    *   `rayDirX = player.dirX + player.planeX * cameraX`
    *   `rayDirY = player.dirY + player.planeY * cameraX`

### Algoritmo DDA (Digital Differential Analyzer)

#### Variables de Estado
Necesitamos saber en qué casilla de mapa estamos y hacia dónde vamos.
*   `mapX`, `mapY`: `floor(player.x)`, `floor(player.y)`.
*   `deltaDistX`, `deltaDistY`: Distancia que el rayo debe avanzar para cruzar **una unidad** entera de X o Y.
    *   **Derivación**: Pitágoras. Si `dx = 1`, entonces hipotenusa = `sqrt(1^2 + (rayDirY/rayDirX)^2)`.
    *   **Simplificación**: `abs(1 / rayDirX)` y `abs(1 / rayDirY)`.
    *   **Caso Borde**: Si `rayDirX == 0`, `deltaDistX` es `Infinity`. JS lo maneja bien, pero bueno saberlo.

#### Inicialización (`sideDist`)
Distancia desde la posición inicial EXACTA hasta el **primer** lado vertical u horizontal.
*   Si `rayDirX < 0`: (Vamos izquierda) `sideDistX = (rayPosX - mapX) * deltaDistX`
*   Si `rayDirX > 0`: (Vamos derecha) `sideDistX = (mapX + 1.0 - rayPosX) * deltaDistX`
*   Idem para Y. Esto sincroniza el rayo con la rejilla.

### El Bucle de Búsqueda (The "Step")
Un `while(hit == 0)` que salta de casilla en casilla.

1.  **Comparación**: ¿Es más corto ir al siguiente borde X o al siguiente borde Y?
    ```typescript
    if (sideDistX < sideDistY) {
      sideDistX += deltaDistX;
      mapX += stepX;
      side = 0; // Golpemos un muro vertical (Norte/Sur)
    } else {
      sideDistY += deltaDistY;
      mapY += stepY;
      side = 1; // Golpeamos un muro horizontal (Este/Oeste)
    }
    ```
2.  **Check**: `if (world.getWall(mapX, mapY) > 0) hit = 1;`

---

## 2. Contenido Educativo

### Sección 1: ¿Por qué no avanzamos `x += 0.1`?
*   Explicar el problema del "rayo saltarín" (overshoot) si avanzamos pasos fijos.
*   Explicar el problema de rendimiento si el paso es muy pequeño (0.0001).
*   Diagrama: Mostrar cómo DDA salta exactamente a las intersecciones de la cuadrícula.

### Sección 2: Pitágoras en esteroides
Desglosar gráficamente qué significan `sideDist` y `deltaDist`. Son triángulos rectángulos semejantes.

### Sección 3: Visualización de Debug
*   Usar la rutina `drawLine` del capítulo básico.
*   Dibujar una línea desde `player` hasta (player + rayDir * wallDist).
*   Resultado: Un "radar" o "cono de visión" en el minimapa.

## 3. Tarea para el Lector
*   Implementar la clase `Raycaster`.
*   Conectar el bucle de renderizado para llamar a `castRays()`.
*   Verificar que los rayos SE DETIENEN en las paredes del mapa definido en la Parte 1.
