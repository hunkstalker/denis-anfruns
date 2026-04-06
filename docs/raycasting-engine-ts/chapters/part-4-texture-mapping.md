# Part 4: Texturizado (El Reto Matemático)

## Objetivo Didáctico
Abandonar los colores sólidos. Implementar "Texture Mapping" manual. Aprenderemos cómo mapear una imagen 2D sobre una superficie vertical 3D renderizando píxel a píxel. Este es el salto visual definitivo.

**Meta Final del Capítulo**: Paredes con ladrillos, madera y piedra perfectamente alineados.

---

## 1. Especificación Técnica

### Cálculo de Coordenada U (Horizontal)
Necesitamos saber qué columna exacta de la textura (`texX`) corresponde al rayo actual.
1.  **Intersección Exacta (`wallX`)**: Punto decimal donde el rayo golpeó la pared.
    *   Si impactó lado vertical (`side == 0`): `wallX = player.y + perpWallDist * rayDirY`
    *   Si impactó lado horizontal (`side == 1`): `wallX = player.x + perpWallDist * rayDirX`
2.  **Normalización**:
    *   `wallX -= floor(wallX)`: Nos quedamos solo con la parte decimal `[0.0, 1.0]`.
3.  **Escalado a Textura**:
    *   `texX = floor(wallX * texWidth)`
    *   **Corrección de Dirección**: Si miramos al Sur o al Oeste, la textura aparecerá espejada.
        *   `if (side == 0 && rayDirX > 0) texX = texWidth - texX - 1;`
        *   `if (side == 1 && rayDirY < 0) texX = texWidth - texX - 1;`

### Mapeo Vertical (Interpolación)
Debemos estirar o encoger la textura para que quepa en la línea vertical de altura `lineHeight`.
Hacerlo con `float` es lento. Usaremos matemática de paso fijo (fixed-point idea).

1.  **El Paso (`step`)**: Cuántos píxeles de textura avanzamos por cada píxel de pantalla.
    *   `step = 1.0 * texHeight / lineHeight`
2.  **Posición Inicial (`texPos`)**:
    *   `texPos = (drawStart - h / 2 + lineHeight / 2) * step`
    *   Iniciar el acumulador correctamente para que, si el muro se sale de la pantalla (clip), empecemos a leer la textura en el punto correcto.

### Bucle de Renderizado Vertical (Draw Loop)
Este es el bucle interno crítico (Inner Loop).

```typescript
for (let y = drawStart; y < drawEnd; y++) {
    // Cast a entero para coordenada Y de textura (AND bitwise para seguridad si pow2)
    const texY = Math.floor(texPos) & (texHeight - 1); 
    texPos += step;
    
    // Obtener color desde el array de la textura
    const color = textures[texNum][texHeight * texY + texX];
    
    // Sombreado (si aplica)
    if (side == 1) color = (color >> 1) & 8355711; // Truco bitwise para oscurecer
    
    buffer[y * screenWidth + x] = color;
}
```

---

## 2. Contenido Educativo

### Sección 1: Gestión de Assets
*   **Problema**: `getImageData` es lento si se llama en cada frame.
*   **Solución**: Cargar imágenes al inicio y volcarlas a Arrays `Uint32Array` y `width/height` guardados en memoria. Crear una clase `Texture`.

### Sección 2: La matemática del Mapeo
*   Diagrama: Mostrar cómo `wallX` "recorre" el borde de la celda de 0 a 1.
*   Explicar el concepto de **Interpolación Lineal** (Lerp) que estamos haciendo manualmente en el eje Y.

### Sección 3: Aliasing y Moiré
*   Observaremos "ruido" en las texturas lejanas.
*   Breve mención a Mipmapping (solución profesional) vs nuestra solución pixelada "crisp" (estilo retro).

## 3. Tarea para el Lector
*   Buscar texturas de 64x64 (formato Wolf3D).
*   Implementar la carga de texturas asíncrona.
*   Integrar la lógica de texture mapping en el bucle principal.
*   Disfrutar del look "Doom/Wolfenstein" auténtico.
