# Part 5: Sprites y Entidades

## Objetivo Didáctico
Poblar el mundo. Los muros son estáticos, pero los juegos necesitan objetos y enemigos. Renderizaremos "Sprites" (imágenes planas) que siempre miran al jugador (Billboarding) y gestionaremos su profundidad correctamente para que se escondan detrás de los muros.

**Meta Final del Capítulo**: Colocar una armadura, una lámpara y un enemigo en el mapa y poder rodearlos.

---

## 1. Especificación Técnica

### Estructura del Sprite
Los sprites no están en la rejilla `map[][]`. Tienen coordenadas libres.
```typescript
class Sprite {
  x: number;
  y: number;
  textureId: number;
}
```

### Z-Buffer (Depth Buffer 1D)
Necesitamos recordar a qué distancia estaba el muro en cada columna vertical para saber si el sprite debe ocultarse.
1.  **Creación**: Array `zBuffer = new Float32Array(screenWidth)`.
2.  **Llenado**: Durante el Raycasting de muros (Part 3/4), guardar `perpWallDist` en `zBuffer[x]`.

### Matemática de Proyección de Sprites
Es diferente a los muros. Transformamos el sprite al "espacio de cámara".

1.  **Posición Relativa**:
    *   `spriteX = sprite.x - player.x`
    *   `spriteY = sprite.y - player.y`
2.  **Matriz Inversa de Cámara** (Determinante):
    Para rotar el sprite y que quede alineado con la visión del jugador.
    *   `invDet = 1.0 / (planeX * dirY - dirX * planeY)`
    *   `transformX = invDet * (dirY * spriteX - dirX * spriteY)`
    *   `transformY = invDet * (-planeY * spriteX + planeX * spriteY)` (Esta es la profundidad Z real).
3.  **Proyección en Pantalla**:
    *   `spriteScreenX = int((width / 2) * (1 + transformX / transformY))`
    *   El centro del sprite en pantalla.

### Dimensiones del Sprite
Igual que los muros, escalan con la inversa de la profundidad (`transformY`).
*   `spriteHeight = abs(screenHeight / transformY)`
*   `drawStartY`, `drawEndY` (check clamping).
*   `spriteWidth = abs(screenHeight / transformY)` (Normalmente cuadrados asumimos aspect ratio 1:1).
*   `drawStartX`, `drawEndX`.

### Bucle de Dibujado
Doble bucle X / Y sobre el área calculada.
1.  **Check Básico**: `if (transformY <= 0) continue` (Está detrás del jugador).
2.  **Bucle X** (`stripe` de `drawStartX` a `drawEndX`):
    *   **Z-Buffer Check**: `if (transformY < zBuffer[stripe])`:
        *   El sprite está MÁS CERCA que el muro -> DIBUJAR.
        *   Si no, el muro lo tapa -> Ocultar.
3.  **Bucle Y** (Copiar píxeles de textura):
    *   Manejar transparencia (si `pixelColor != transparente` pintar).

### Ordenamiento (Painter's Algorithm)
Si hay múltiples sprites, uno puede tapar a otro.
*   Calcular distancia de cada sprite al jugador: `((player.x - sprite.x)^2 + ...)`
*   Ordenar array de sprites de **Mayor a Menor** distancia.
*   Dibujar en ese orden.

---

## 2. Contenido Educativo

### Sección 1: Matrices 2x2
*   Explicar intuitivamente la matriz de transformación. Estamos "des-rotando" el mundo para que el jugador mire siempre al Norte (eje Y+), simplificando así la proyección.

### Sección 2: El Truco del Z-Buffer 1D
*   En 3D moderno usamos Z-Buffer por píxel (muy costoso en memoria para la época).
*   En Raycasting, basta con 1 valor por columna vertical. Optimización clásica.

## 3. Tarea para el Lector
*   Implementar el sistema de Sprites.
*   Colocar varios objetos en el mapa JSON.
*   Verificar que al pasar detrás de una columna, el objeto desaparece correctamente (Z-Buffer funcionando).
