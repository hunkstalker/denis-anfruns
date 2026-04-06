# Part 1: The Virtual PPU (Tu Propia Tarjeta Gráfica)

## Objetivo Didáctico
Los navegadores pintan vectores y HTML. Nosotros queremos píxeles.
Crearemos una abstracción `VideoBuffer` que nos permita escribir colores `0xAABBGGRR` directamente en memoria, saltándonos toda la capa de abstracción del navegador.

**Meta**: Una pantalla negra que podemos llenar de ruido estático a 60 FPS manipulando millones de enteros por segundo.

## 1. El Canvas como Framebuffer
```typescript
class Display {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    imageData: ImageData;
    buffer: Uint32Array; // Acceso de 32 bits (Rápido)

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;
        this.canvas = document.createElement("canvas");
        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx = this.canvas.getContext("2d")!;
        
        // La llave maestra: ImageData
        this.imageData = this.ctx.createImageData(w, h);
        // Vista de 32 bits sobre el buffer de memoria
        this.buffer = new Uint32Array(this.imageData.data.buffer);
    }
    
    render() {
        // Vuelca el buffer a la GPU del navegador
        this.ctx.putImageData(this.imageData, 0, 0);
    }
    
    clear(color: number = 0xFF000000) {
        this.buffer.fill(color);
    }
    
    drawPixel(x: number, y: number, color: number) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
        this.buffer[y * this.width + x] = color;
    }
}
```

## 2. Formato de Color (Little Endian)
Cuidado: `Canvas` usa RGBA, pero los procesadores Intel/ARM (Little Endian) escriben los bytes al revés en `Uint32Array`.
*   Formato esperado: **ABGR** (`0xAABBGGRR`).
*   `0xFF0000FF` = Rojo opaco.
*   `0xFF00FF00` = Verde opaco.

## 3. Optimizaciones
*   No crear objetos en el render loop.
*   Usar `Math.floor` o bitwise OR `| 0` para coordenadas enteras.
