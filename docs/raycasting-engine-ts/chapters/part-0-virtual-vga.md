# Part 0: La Máquina Virtual (Virtual VGA)

## Objetivo Didáctico
El objetivo es establecer la base tecnológica del motor. Aprenderemos a ignorar las facilidades modernas del navegador para trabajar "al metal" (o lo más cerca posible en JS), simulando cómo funcionaban las tarjetas gráficas antiguas (VGA mode 13h) en un entorno moderno.

**Meta Final del Capítulo**: Tener un Canvas negro donde podemos pintar ruido estático a 60 FPS usando manipulación directa de memoria.

---

## 1. Especificación Técnica

### El Framebuffer (`VirtualScreen`)
No usaremos APIs de dibujo vectorial. Gestionaremos la memoria de video manualmente.

#### Estructura de Datos
```typescript
class VirtualScreen {
  private width: number;
  private height: number;
  private ctx: CanvasRenderingContext2D;
  private imageData: ImageData;
  private buffer: Uint32Array; // Acceso 32-bit (RGBA)

  constructor(width: number, height: number) {
    // Inicializar canvas y buffer
    // IMPORTANTE: Explicar por qué Uint32Array es más rápido que Uint8ClampedArray
    // para pintar píxeles (1 operación de escritura vs 4).
    this.buffer = new Uint32Array(this.imageData.data.buffer);
  }
}
```

#### Coordinate Space vs Memory Space
La pantalla es 2D, la memoria es 1D.
*   **Fórmula de Acceso**: `index = y * width + x`
*   **Gestión de Aspect Ratio**:
    *   Mantener resolución interna baja (ej. 320x200 o 640x480) independientemente del tamaño del canvas CSS.
    *   Uso de `image-rendering: pixelated` en CSS para evitar borrosidad al escalar.

#### Operaciones Bitwise con Colores
Los colores en `Uint32Array` se almacenan en formato Little Endian (normalmente `ABGR` en x86).
*   **Formato**: `0xAABBGGRR` (Alpha, Blue, Green, Red).
*   **Macro/Helper**:
    ```typescript
    // Empaquetar color (r, g, b) -> 0xFFBBGGRR
    // Explicar desplazamiento de bits (<<) y OR (|)
    const color = (255 << 24) | (b << 16) | (g << 8) | r;
    ```

---

## 2. El Game Loop (El corazón del tiempo)

### Arquitectura del Bucle
Implementaremos un bucle desacoplado (update lógica vs render).

1.  **`requestAnimationFrame`**:
    *   Explicar vs `setInterval`: Sincronización con VSync, ahorro de batería.
2.  **Delta Time (`dt`)**:
    *   Cálculo: `currentTime - lastTime`.
    *   Normalización: `dt` en segundos (ej. 0.016 para 60fps).
    *   **Trampa común**: `dt` muy grandes (lag spikes) rompiendo colisiones. Implementar `Math.min(dt, 0.1)`.

### Esqueleto de Clases
```typescript
interface Game {
  update(dt: number): void;
  render(): void;
}

class Engine {
  private lastTime: number = 0;
  
  start() {
    this.loop(0);
  }

  private loop(timestamp: number) {
    const dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;
    
    this.game.update(dt);
    this.screen.clear(0x000000); // Método rápido fill()
    this.game.render();
    this.screen.present(); // putImageData
    
    requestAnimationFrame(t => this.loop(t));
  }
}
```

---

## 3. Contenido Educativo (El "Guion")

### Sección 1: "¿Por qué es tan lento pixel a pixel?"
*   Explicar la sobrecarga de llamar a funciones como `fillRect` 64,000 veces por frame.
*   Introducción a los **Arrays Tipados** en JS (`Int32Array` vs Array normal).

### Sección 2: "¿Dónde está mi píxel?"
*   Diagrama visual: Mapeo de matriz (x,y) a cinta lineal de memoria.
*   Ejercicio interactivo: Calcular el índice manual de un píxel en el centro de la pantalla.

### Sección 3: El Color es un Número
*   Desmitificar HEX: `0xFF00FF`.
*   Ver en consola cómo JS interpreta esos números (Enteros con signo vs sin signo).

## 4. Tarea para el Lector (Implementación final)
*   Crear la clase `VirtualScreen`.
*   Dibujar "nieve" (ruido aleatorio) en el método `render` para probar rendimiento.
*   Si logras 60FPS con 320x200 de ruido, tu buffer funciona.
