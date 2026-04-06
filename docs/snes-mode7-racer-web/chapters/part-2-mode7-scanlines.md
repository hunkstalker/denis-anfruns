# Part 2: Mode 7 Scanlines (Matemática en el Bucle)

## Objetivo Didáctico
Implementar el algoritmo de proyección inversa de SNES, pero esta vez ejecutándose en la CPU línea a línea.

**Meta**: Ver el suelo girar y moverse con perspectiva correcta, renderizado por nuestro software engine.

## 1. El Algoritmo Scanline
Para cada línea horizontal de la pantalla (`y`), todos sus píxeles tienen la misma "distancia Z" al plano del suelo.
Podemos precalcular los factores de escala **una vez por línea**, no por píxel. ¡Optimización masiva!

```typescript
renderMode7(camera: Camera, map: Uint32Array, mapSize: number) {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;
    
    // Distancia focal (Zoom)
    const fov = this.height; 

    for (let y = 0; y < this.height; y++) {
        // La mitad de arriba es cielo
        if (y < halfHeight) {
            // Dibujar cielo...
            continue;
        }

        // 1. Proyección 1/Z: Calcular distancia al suelo para esta línea
        // Cuanto más abajo en pantalla, más cerca (distancia menor)
        const rowDistance = fov / (y - halfHeight);
        
        // 2. Extremos de la línea de escaneo en el mundo
        // "Floor step": Cuánto nos movemos en el texturado X/Y por cada píxel de pantalla
        const stepX = rowDistance * Math.cos(camera.angle) / this.width;
        const stepY = rowDistance * Math.sin(camera.angle) / this.width;
        
        // 3. Inicio del barrido (Lado izquierdo de la pantalla, en el mundo)
        let floorX = camera.x + (Math.cos(camera.angle - 0.5) * rowDistance); // Simplificado
        let floorY = camera.y + (Math.sin(camera.angle - 0.5) * rowDistance);

        // 4. Bucle Horizontal (Rasterizado)
        // Recorremos la línea rellenando píxeles
        const offset = y * this.width;
        for (let x = 0; x < this.width; x++) {
            // Coordenada de textura (Wrapping)
            const tx = (floorX | 0) & (mapSize - 1);
            const ty = (floorY | 0) & (mapSize - 1);
            
            // Samplear color del mapa
            const color = map[ty * mapSize + tx];
            
            // Escribir al buffer
            this.buffer[offset + x] = color;
            
            // Avanzar en el mundo
            floorX += stepX;
            floorY += stepY;
        }
    }
}
```

## 2. Look "Crunchy"
Al usar `(floorX | 0)`, estamos forzando enteros. Esto crea automáticamente el efecto *Nearest Neighbor* sin interpolación. Es el "pixel art perfect" nativo.
