# Part 3: Sprite Rasterization (Pintando a Mano)

## Objetivo Didáctico
No tenemos `ctx.drawImage`. Tenemos que copiar píxeles de un array (el sprite) a otro array (la pantalla) manualmente, saltándonos los transparentes.

**Meta**: Árboles y Karts que se escalan correctamente y se tapan unos a otros.

## 1. Proyección de Objetos
Igual que en Godot, calculamos `screenX` y `scale`.
```typescript
const relX = sprite.x - cam.x;
const relY = sprite.y - cam.y;
// Rotar alrededor de cámara
const rotX = relX * cos - relY * sin;
const rotZ = relX * sin + relY * cos;

if (rotZ < 1) return; // Detrás de la cámara

const scale = fov / rotZ;
const screenX = (width / 2) + (rotX * scale);
const screenY = (height / 2) + scale /* Altura suelo */ - (sprite.h * scale);
```

## 2. Loops de Dibujado (The Blitter)
Aquí está la magia del software rendering.
Tenemos que iterar sobre los píxeles del sprite RESCALADO.

```typescript
function drawSprite(sprite, screenX, screenY, scale) {
    const drawWidth = sprite.w * scale;
    const drawHeight = sprite.h * scale;
    
    // Clipping: Calcular límites para no salirnos del array (Crash!)
    const startX = Math.max(0, screenX);
    const endX = Math.min(SCREEN_WIDTH, screenX + drawWidth);
    
    for (let x = startX; x < endX; x++) {
        // ¿Qué pixel del sprite original toca? (Inverse mapping)
        const texX = ((x - screenX) / scale) | 0;
        
        for (let y = startY; y < endY; y++) {
            const texY = ((y - screenY) / scale) | 0;
            
            const color = sprite.pixels[texY * sprite.w + texX];
            
            if (color !== TRANSPARENT) {
                buffer[y * SCREEN_WIDTH + x] = color;
            }
        }
    }
}
```

## 3. Depth Sorting (Painter's Algorithm)
Como no tenemos Z-Buffer por píxel (muy caro en JS para este estilo), usamos **Ordenamiento de Pintor**.
1.  Calcular distancia (`rotZ`) de todos los objetos.
2.  Ordenar la lista de más lejos a más cerca: `sprites.sort((a,b) => b.z - a.z)`.
3.  Dibujar en orden. Los cercanos sobrescribirán a los lejanos.
