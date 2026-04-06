# Asset Manifest & Fallbacks: SNES Mode 7 Racer (Web)

## 1. Textura del Circuito (1024x1024)
Generar un `OffscreenCanvas` y pintar en él una vez al inicio.
*   **Fondo**: `ctx.fillStyle = '#333'; ctx.fillRect(0,0,1024,1024);`
*   **Césped**: Dibujar rectángulos verdes aleatorios o usar `createPattern` con un png de ruido base64 (si se permite) o ruido perlin simple.
*   **Pista**: Dibujar un camino usando `ctx.beginPath(); ctx.moveTo(...); ctx.bezierCurveTo(...);` con `ctx.lineWidth = 150` y `ctx.stroke()`.
*   **Bordes**: Repetir el trazado con `lineWidth = 160` y color rojo/blanco (`setLineDash`) para los pianos.

## 2. Sprites (Karts)
Generar `ImageData` para un sprite de 32x32.
*   **Generador**: Función `createKartSprite(color: string): ImageData`.
*   **Dibujo**:
    *   Dibujar un triángulo apuntando hacia arriba.
    *   Añadir dos rectángulos negros laterales (ruedas).
    *   Añadir un punto amarillo detrás (tubo de escape).

## 3. Sprites (Objetos)
*   **Moneda**: Círculo amarillo con borde naranja.
*   **Árbol**: Círculo verde grande sobre rectángulo marrón pequeño.

## 4. Notas de Rendimiento
Una vez generado el asset proceduralmente, extrae su `Uint32Array` y guárdalo en cache. **NO** llames a `ctx.getImageData` en cada frame (es lentísimo).
