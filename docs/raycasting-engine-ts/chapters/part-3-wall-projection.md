# Part 3: Alzando Muros (Proyección y Ojo de Pez)

## Objetivo Didáctico
Convertir el array de distancias calculado en el paso anterior en una imagen 3D. Aquí es donde ocurre la magia. Pasaremos de ver líneas en un mapa 2D a ver pasillos tridimensionales.

**Meta Final del Capítulo**: Navegar por el laberinto viendo paredes sólidas con correcta perspectiva.

---

## 1. Especificación Técnica

### Corrección de Ojo de Pez (Fisheye Fix)
Si usamos la distancia euclidiana pura (`sqrt(dx*dx + dy*dy)`), las paredes se verán redondas al girar.
*   **Problema**: Los rayos laterales recorren más distancia que el central para chocar con la misma pared plana.
*   **Solución**: Calcular la **distancia proyectada** sobre el vector de dirección de la cámara.
    *   No necesitamos `cos()`. El DDA nos da los datos para calcularlo:
    *   Si `side == 0`: `perpWallDist = (sideDistX - deltaDistX)`
    *   O la versión simplificada: `perpWallDist = (mapX - rayPosX + (1 - stepX) / 2) / rayDirX`
    *   **Nota Didáctica**: Explicar que esto es matemáticamente equivalente a `distanciaEuclidiana * cos(anguloRayo - anguloJugador)`, pero mucho más rápido.

### Proyección en Altura
Calcular cuán alta (en píxeles) es la línea a dibujar.
*   `lineHeight = (ScreenHeight / perpWallDist)`
    *   A veces se necesita un factor de escala si el FOV no es estándar. `h = (ScreenHeight / perpWallDist) * escala`.

### Renderizado de Columnas (Vertical Scanlines)
Para cada x en pantalla:
1.  **Calcular Techo y Suelo**:
    *   `drawStart = -lineHeight / 2 + ScreenHeight / 2`
    *   `drawEnd = lineHeight / 2 + ScreenHeight / 2`
    *   **Clamping**: Asegurar que `drawStart >= 0` y `drawEnd < ScreenHeight`.
2.  **Dibujar (Buffer Access)**:
    *   Bucle `for (y = drawStart; y < drawEnd; y++)`
    *   `putPixel(x, y, wallColor)`

### Sombreado Básico (Luz Direccional Falsa)
Para percibir mejor las esquinas:
*   Si `side == 1` (pared E/W), oscurecer el color.
*   `color = (side == 1) ? (baseColor / 2) : baseColor`.
*   Implementación byte-level: `(color >> 1) & 0x7F7F7F`. (Shift divide por 2, Mask protege overflow de bits).

---

## 2. Contenido Educativo

### Sección 1: El Teorema de Tales
Explicar la semejanza de triángulos que fundamenta la proyección perspectiva.
*   `AlturaReal / Distancia = AlturaPantalla / DistanciaPlanoProyeccion`

### Sección 2: ¿Por qué Fisheye?
*   Gráfico: Mostrar el reproductor frente a una pared plana.
*   Mostrar cómo los rayos forman un triángulo.
*   Demostrar que corregir con coseno aplana la pared.

### Sección 3: Optimización de Dibujado
*   En lugar de usar `putPixel` en un bucle, ¿podemos optimizar?
*   Debate sobre si escribir en buffer `Uint32Array` secuencialmente es mejor. (Para columnas verticales, el acceso a memoria NO es lineal `idx += width`, así que no podemos usar `fill` de arrays, pero sigue siendo rápido).

## 3. Tarea para el Lector
*   Implementar cálculo de `perpWallDist`.
*   Crear bucle de dibujado vertical.
*   Añadir colores distintos según el valor del mapa (`map[x][y] == 1` -> Rojo, `2` -> Azul).
*   ¡Caminar por tu primer mundo 3D!
